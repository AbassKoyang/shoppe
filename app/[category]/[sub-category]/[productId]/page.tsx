'use client';

import ProductImagesCarousel from "@/components/ProductImagesCarousel";
import ProductPageSkeleton from "@/components/ProductPageSkeleton";
import { useAuth } from "@/lib/contexts/auth-context";
import { formatPrice } from "@/lib/utils";
import { addProductToRecentlyViewed, addProductToWishlist, isProductInWishlist, removeProductFromWishlist } from "@/services/products/api";
import { useFetchSingleProduct } from "@/services/products/queries";
import { ProductType, WishlistType } from "@/services/products/types";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Heart, LoaderCircle, MessageCircle, MessageSquareText, Settings } from "lucide-react";
import { IoHeart } from "react-icons/io5";
import { redirect, useParams, useRouter } from "next/navigation"
import { useState, useEffect, use } from "react";
import { IoIosShareAlt } from "react-icons/io";
import { toast } from "react-toastify";
import { usePaymentMethods } from "@/services/payment/queries";
import { Card, CardContent } from "@/components/ui/card";
import { paymentMethodType } from "@/services/payment/types";
import BuyProductModal from "@/components/product-page/BuyProductModal";
import PaymentInProgressModal from "@/components/product-page/PaymentInProgressModal";
import PaymentFailedModal from "@/components/product-page/PaymentFailedModal";
import { string } from "zod";
import PaymentSuccesfulModal from "@/components/product-page/PaymentSuccessfulModal";

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
  const [transactionDetails, setTransactionDetails] = useState<transactionDetailsType>();
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

  const price = formatPrice(product?.price.toString() || '', product?.currency || '');

  useEffect(() => {
    handleAddProductToRecentlyViewed()
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
        setTransactionDetails(data);
        console.log(data);
      } else {
        setError(data.error);
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
          <ProductImagesCarousel viewportWidth={viewportWidth} images={product?.images || []} />
      <div className="px-4 [@media(min-width:375px)]:px-6 bg-white mb-[100px]">
        <div className="w-full flex items-center justify-between my-5">
          <h4 className="text-[26px] text-black font-raleway font-extrabold">{price}</h4>
          <button className="size-[43px] flex items-center justify-center bg-[#FFEBEB] rounded-full cursor-pointer">
          <IoIosShareAlt className="size-[22px] text-[#B5A2A2]" />
          </button>
        </div>
        <div className="w-full">
          <h5 className="text-[20px] text-black font-raleway font-bold leading-[1]">{product?.title}</h5>
          <p className="text-[15px] text-black font-nunito-sans font-normal mt-1">{product?.description}</p>
        </div>
        <div className="w-full my-5">
         <h5 className="text-[20px] text-black font-raleway font-extrabold ">Specifications</h5>
        <div className="w-full flex flex-wrap justify-between items-start">
    
          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Category</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#FFEBEB] py-0.5 px-3 rounded-[4px] mt-1">{product?.category}</span>
          </div>

          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Sub Category</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">{product?.subCategory}</span>
          </div>

          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Size</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">{product?.size}</span>
          </div>

          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Condition</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#FFEBEB] py-0.5 px-3 rounded-[4px] mt-1">{product?.condition == 'new' ? 'New' : 'Used'}</span>
          </div>

          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Discount</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#FFEBEB] py-0.5 px-3 rounded-[4px] mt-1">{product?.discount}%</span>
          </div>

          {product?.gender && (
            <div className="w-[50%] flex flex-col items-start">
              <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Gender</h6>
              <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">{product?.gender}</span>
            </div>
          )}

          {product?.material && (
          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Material</h6>
            <div className="w-full flex flex-wrap gap-2">
            {product?.material.split(',').map((mat) => (
              <span key={mat} className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">
                {mat}
              </span>
            ))}
            </div>
          </div>
          )}

          {product?.brand && (
          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Brand</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#FFEBEB] py-0.5 px-3 rounded-[4px] mt-1">{product?.brand}</span>
          </div>
          )}

          {product?.color && (
          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Color</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#FFEBEB] py-0.5 px-3 rounded-[4px] mt-1">{product?.color}</span>
          </div>
          )}
          
          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Location</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">{product?.location}</span>
          </div>
        </div>
        </div>
      </div>
      <div className="w-[97%] fixed bottom-3 left-[50%] translate-x-[-50%] px-3 [@media(min-width:375px)]:px-3 py-3 bg-white flex items-center justify-between rounded-[40px] shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
        {isInWishList ? (
                  <button onClick={() => handleRemoveProductFromWishList()} className="cursor-pointer w-[47px] h-[47px] rounded-full bg-[#F9F9F9] flex items-center justify-center">
                  {loading ? (<LoaderCircle className="animate-spin size-[28px] text-black" />) : (<IoHeart className="text-black size-[28px]" />)}
                 </button>
        ) : (
                <button onClick={() => handleAddProductToWishList(product)} className="cursor-pointer w-[47px] h-[47px] rounded-full bg-[#F9F9F9] flex items-center justify-center">
                {loading ? (<LoaderCircle className="animate-spin size-[28px] text-black" />) : ( <Heart strokeWidth={1} className="text-black size-[28px]" />)}
              </button>
        )}

        <button onClick={() => router.push(`/chat/${productId}_${user?.uid}_${product.sellerId}`)} className="cursor-pointer bg-black rounded-4xl px-4 py-2 flex items-center gap-2"><MessageCircle  strokeWidth={1} className="text-white h-lh" /><span className="text-[16px] font-normal font-nunito-sans text-[#F3F3F3]">Chat Seller</span></button>
        <button onClick={() => setIsBuyProductModalOpen(true)} className="cursor-pointer bg-dark-blue text-white rounded-4xl px-4 py-2 font-normal font-nunito-sans text-[16px]">Buy</button>
      </div>

      <BuyProductModal buyProduct={() => handleBuyProduct(user?.uid || '')} selectedCard={selectedCard} setSelectedCard={(card: paymentMethodType) => setSelectedCard(card)} open={isBuyProductModalOpen} closeModal={() => setIsBuyProductModalOpen(false)} />
      <PaymentInProgressModal open={isPaymentInProgress} />
      <PaymentFailedModal closeModal={() => setError(null)} open={error ? true : false} error={error} tryAgain={() => { setError(null); handleBuyProduct(user?.uid || '')}} />
      <PaymentSuccesfulModal open={isPaymentSuccessful} closeModal={() => setisPaymentSuccessful(false)} redirect={() => {
        router.replace(`/transactions/${transactionDetails?.transaction.id}`)
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