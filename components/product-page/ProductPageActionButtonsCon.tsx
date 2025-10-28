'use client';
import { useAuth } from '@/lib/contexts/auth-context';
import { ProductType } from '@/services/products/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { Heart, LoaderCircle, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { IoHeart } from 'react-icons/io5'

const ProductPageActionButtonsCon = ({isInWishList, loading, product, productId, removeFromWishList, addToWishList, openModal} : {isInWishList: boolean; loading: boolean; product: ProductType;  productId: string; removeFromWishList: () => void; addToWishList: () => void; openModal: () => void}) => {
  const {user} = useAuth();
    const router = useRouter();

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from('.con-animate', {
            bottom: -30,
            duration: 0.3, 
            ease: "power2.inOut" ,
        })
        tl.from('.gsap-animate', {
            y: 50,
            duration: 0.3, 
            ease: "power1.inOut" ,
            stagger: {
                each: 0.09,
                from: 'start',
                grid: 'auto',
                ease: 'power2.inOut',
            },
        })
    }, {dependencies: [user], scope:''})

  return (
    <>
    {user?.uid !== product.sellerId && product.status !== 'sold' && (
        <div className="con-animate w-[97%] fixed bottom-3 left-[50%] translate-x-[-50%] px-3 [@media(min-width:375px)]:px-3 py-3 bg-white flex items-center justify-between rounded-[40px] shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
            {isInWishList ? (
                    <button onClick={removeFromWishList} className="cursor-pointer w-[47px] h-[47px] rounded-full bg-[#F9F9F9] flex items-center justify-center">
                    {loading ? (<LoaderCircle className="gsap-animate animate-spin size-[28px] text-black" />) : (<IoHeart className="text-black size-[28px]" />)}
                    </button>
            ) : (
                    <button onClick={addToWishList} className="gsap-animate cursor-pointer w-[47px] h-[47px] rounded-full bg-[#F9F9F9] flex items-center justify-center">
                    {loading ? (<LoaderCircle className="animate-spin size-[28px] text-black" />) : ( <Heart strokeWidth={1} className="text-black size-[28px]" />)}
                </button>
            )}

            <button onClick={() => router.push(`/chat/${productId}_${user?.uid}_${product.sellerId}`)} className="gsap-animate cursor-pointer bg-black rounded-4xl px-4 py-2 flex items-center gap-2"><MessageCircle  strokeWidth={1} className="text-white h-lh" /><span className="text-[16px] font-normal font-nunito-sans text-[#F3F3F3]">Chat Seller</span></button>
            <button onClick={openModal} className="gsap-animate cursor-pointer bg-dark-blue text-white rounded-4xl px-4 py-2 font-normal font-nunito-sans text-[16px]">Buy</button>
        </div>
    )}
    </>
  )
}

export default ProductPageActionButtonsCon