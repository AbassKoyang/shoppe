'use client';

import ProductImagesCarousel from "@/components/ProductImagesCarousel";
import ProductPageSkeleton from "@/components/ProductPageSkeleton";
import { useAuth } from "@/lib/contexts/auth-context";
import { addProductToRecentlyViewed, addProductToWishlist, incrementProductViews, isProductInWishlist, removeProductFromWishlist } from "@/services/products/api";
import { useFetchSingleProduct } from "@/services/products/queries";
import { ProductType, WishlistType } from "@/services/products/types";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { redirect, useParams, useRouter } from "next/navigation"
import { useState, useEffect, use } from "react";
import { IoIosShareAlt } from "react-icons/io";
import { usePaymentMethods } from "@/services/payment/queries";
import { Card, CardContent } from "@/components/ui/card";
import { OrderDataType, paymentMethodType } from "@/services/payment/types";
import BuyProductModal from "@/components/product-page/BuyProductModal";
import PaymentInProgressModal from "@/components/product-page/PaymentInProgressModal";
import PaymentFailedModal from "@/components/product-page/PaymentFailedModal";
import PaymentSuccesfulModal from "@/components/product-page/PaymentSuccessfulModal";
import Specification from "@/components/product-page/Specification";
import ProductPageActionButtonsCon from "@/components/product-page/ProductPageActionButtonsCon";
import SellerInfo from "@/components/product-page/SellerInfo";
import { toast } from "react-toastify";

type transactionDetailsType = {
  success: boolean;
  message: 'Payment successful';
  transaction: {
    id: string;
    amount:  number;
    reference: string;
    status: string;
  }
}

const page = () => {
  const router = useRouter();
  const {user} = useAuth();
  const productId = useParams<{productId: string}>().productId;
  const {isError, isLoading, data: product} = useFetchSingleProduct(productId);
  const {data: cards} = usePaymentMethods(user?.uid || '');
  const [viewportWidth, setViewportWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isInWishList, setIsInWishlist] = useState(false);
  const [isBuyProductModalOpen, setIsBuyProductModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<paymentMethodType>(cards? cards[0] : {id: '', userId: '', cardHolder: '', brand: '', last4: '', expiryMonth: '', expiryYear: '', email: '', authorisationCode: '', createdAt: ''});
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [error, setError] = useState<{message: string; error: string} | null>(null);
  const [isPaymentSuccessful, setisPaymentSuccessful] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDataType>();
  const queryClient = new QueryClient();

  const addProductToRecentlyViewedMutation = useMutation({
    mutationKey: ['addProductToRecentlyViewed'],
    mutationFn: ({userId, product} : {userId : string; product: ProductType}) => addProductToRecentlyViewed(userId, product),
    onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['recentlyViewed']});
    }
  });
  const addProductToWishlistMutation = useMutation({
    mutationKey: ['addProductToWishList'],
    mutationFn: ({data, userId} : {data : WishlistType; userId: string}) => addProductToWishlist(data, userId),
    onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['wishlists']});
    }
  });
  const removeProductFromWishlistMutation = useMutation({
    mutationKey: ['addProductToWishList'],
    mutationFn: ({userId, productId} : {userId: string; productId: string}) => removeProductFromWishlist(userId, productId),
    onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['wishlists']});
    }
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!product?.id) return;
      const success = await isProductInWishlist(product.id, user?.uid || '');
      if(success){
        if (mounted) setIsInWishlist(true);
      }
    })();
    return () => { mounted = false };
  }, [product?.id]);
  

  const handleAddProductToWishList = async (data: ProductType) => {
  
    try {
        setLoading(true);
      if (!user) {
        toast.error("You must be logged in to add a product to wishlist method.");
        return;
      }
  
      const wish: WishlistType = {
        userId: user.uid,
        product: data,
      };
  
      const succes = await addProductToWishlistMutation.mutateAsync({data: wish, userId: user?.uid});
      if(succes){
        setIsInWishlist(true);
        toast.success(`Item added to wishlist succesfully.`);
      }
    } catch (error: any) {
      console.error("❌ Error adding product to wishlist:", error);
  
      if (error?.code === "permission-denied") {
        toast.error("You don’t have permission to add product to wishlist.");
      } else if (error?.message?.includes("network")) {
        toast.error("Network error — check your connection and try again.");
      } else if(error?.message == 'product-already-in-wishlist') {
        toast.error("Item already in wishlist")
      } else {
        toast.error("Something went wrong while adding product to wishlist. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProductFromWishList = async () => {
  
    try {
        setLoading(true);
      if (!user) {
        toast.error("You must be logged in to remove a product from wishlist.");
        return;
      }  
      const succes = await removeProductFromWishlistMutation.mutateAsync({userId: user?.uid, productId: product?.id ?? ''});
      if(succes){
        setIsInWishlist(false);
        toast.success(`Item removed from wishlist.`);
      }
    } catch (error: any) {
      console.error("❌ Error removing product to wishlist:", error);
  
      if (error?.code === "permission-denied") {
        toast.error("You don’t have permission to remove a product from wishlist.");
      } else if (error?.message?.includes("network")) {
        toast.error("Network error — check your connection and try again.");
      } else {
        toast.error("Something went wrong while removing product from wishlist. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleAddProductToRecentlyViewed = async () => {
  
    try {
      if (!user || !product) {
        return;
      }  
      await addProductToRecentlyViewedMutation.mutateAsync({userId: user?.uid, product: product});
    } catch (error: any) {
      console.error("❌ Error adding product to recently viewed:", error);
  
      if (error?.code === "permission-denied") {
        toast.error("You don’t have permission to add product to recently viewed.");
      } else if (error?.message?.includes("network")) {
        toast.error("Network error — check your connection and try again.");
      } else {
        toast.error("Something went wrong while adding product to recently viewed. Please try again.");
      }
    }
  };

  useEffect(() => {
    setViewportWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    handleAddProductToRecentlyViewed()
  }, [product])
  useEffect(() => {
    if(product) {
      incrementProductViews(product?.id || '')
      console.log("innnnn")
    }
    console.log('outttt')
  }, [product])


  const handleBuyProduct = async (userId: string) => {
    if (!userId || !selectedCard || !productId) {
      console.error('Missing required data:', { userId, selectedCard, productId });
      alert('Missing required information');
      return;
    }
  
    console.log('Sending buy request:', {
      productId,
      buyerId: userId,
      cardId: selectedCard,
    });
    setIsBuyProductModalOpen(false)
    setIsPaymentInProgress(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/products/${productId}/buy`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyerId: userId,
            card: selectedCard,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setisPaymentSuccessful(true)
        setOrderDetails(data.order);
        console.log(data);
      } else {
        setError(data);
      }
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setIsPaymentInProgress(false);
    }
  };
  


  return (
    <section className="w-full relative bg-white">
      {isLoading && (
        <ProductPageSkeleton />
      )}
      {product && (
        <>
          <ProductImagesCarousel product={product} viewportWidth={viewportWidth} images={product?.images || []} />

          <Specification product={product} />

          <SellerInfo sellerId={product.sellerId || ''} />

          <ProductPageActionButtonsCon isInWishList={isInWishList} loading={loading} productId={productId} product={product} removeFromWishList={() => handleRemoveProductFromWishList()} addToWishList={() => handleAddProductToWishList(product)} openModal={() => setIsBuyProductModalOpen(true)} />

          <BuyProductModal buyProduct={() => handleBuyProduct(user?.uid || '')} selectedCard={selectedCard} setSelectedCard={(card: paymentMethodType) => setSelectedCard(card)} open={isBuyProductModalOpen} closeModal={() => setIsBuyProductModalOpen(false)} />

          <PaymentInProgressModal open={isPaymentInProgress} />

          <PaymentFailedModal closeModal={() => setError(null)} open={error ? true : false} error={error} tryAgain={() => { setError(null); handleBuyProduct(user?.uid || '')}} />

          <PaymentSuccesfulModal open={isPaymentSuccessful} closeModal={() => setisPaymentSuccessful(false)} redirect={() => {
            router.push(`/orders/${orderDetails?.id}`)
          }} />
          </>
          )}

          {isError && (
            <div className='w-full h-dvh flex items-center justify-center'>
            <p>Oops, failed to load product.</p>
          </div>
          )}
    </section>
  )
}

export default page