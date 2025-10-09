import { useAuth } from '@/lib/contexts/auth-context';
import { formatDescription, formatPrice, formatProductCardImageUrl, formatProductLink, formatTitle } from '@/lib/utils';
import { removeProductFromWishlist } from '@/services/products/api';
import { ProductType } from '@/services/products/types';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { LoaderCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const WishlistProductCard = ({product}:{product: ProductType}) => {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const queryClient = new QueryClient();
    const removeProductFromWishlistMutation = useMutation({
        mutationKey: ['addProductToWishList'],
        mutationFn: ({userId, productId} : {userId: string; productId: string}) => removeProductFromWishlist(userId, productId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['wishlists']});
        }
      });

      const handleRemoveProductFromWishList = async () => {
  
        try {
            setLoading(true);
          if (!user) {
            toast.error("You must be logged in to remove a product from wishlist method.");
            return;
          }  
          const succes = await removeProductFromWishlistMutation.mutateAsync({userId: user?.uid, productId: product?.id ?? ''});
          if(succes){
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

    const price : string = String(product.price);
    const imageUrl = formatProductCardImageUrl(product.images[0], {
        width: '300',
        height: '300',
        c_fill: true,
        g_auto: true,
        q_auto: true,
        f_auto: true,
        e_sharpen: true,
        dpr_auto: true,
      })
    
      const formattedPrice = formatPrice(price, product.currency);
    
      const title = formatTitle(product.title);
      
      const desc = formatDescription(product.description);
    
      const productLink = formatProductLink(product.category, product.subCategory, product?.id || '');

  return (
    <Link  href={productLink} className='w-full h-[110px] mt-3 flex items-start justify-between'>
           <div className="w-full h-full flex items-start gap-3">
            <div className="w-[130px] relative">
                    <div className="w-full relative h-full p-[5px] rounded-[9px] bg-white overflow-hidden shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
                        <Image
                        src={imageUrl}
                        width={300}
                        height={300}
                        style={{ width: "120px", height: "100px" }}
                        placeholder="blur"
                        blurDataURL="/assets/images/product-fallback-image.png"
                        alt={product.title}
                        sizes="(max-width: 768px) 100px, 150px"
                        className="rounded-[5px] object-cover"/>
                    </div>
                    
                    <button onClick={() => handleRemoveProductFromWishList()} className='cursor-pointer size-[35px] rounded-full bg-white flex items-center justify-center absolute z-20 bottom-3 left-3'>
                    {loading ? (<LoaderCircle className="animate-spin size-[28px] text-black" />) : (<Trash2 className='size-[15px] text-[#FF5790]' />)}
                    </button>
                </div>
                <div className="flex flex-col h-full">
                    <p className='text-[12px] text-black font-nunito-sans font-normal max-w-[140px]'>{desc}</p>
                    <div className=" h-full flex flex-col justify-end">
                        <h5 className='font-raleway font-bold text-[18px] tracking-[-0.18px] text-[#202020]'>{formattedPrice}</h5>
                        <div className='flex items-center gap-2'>
                        {product.color && (
                            <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">{product.color}</span>
                        )}
                        {product.category && (
                            <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">{product.category}</span>
                        )}
                        {product.size && (
                            <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">{product.size}</span>
                        )}
                        </div>
                    </div>
                </div>
           </div>

    </Link>
)
}

export default WishlistProductCard