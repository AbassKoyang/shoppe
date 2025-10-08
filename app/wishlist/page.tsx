'use client'
import ArrowRightButton from '@/components/ArrowRightButton'
import JustForYouProductCard from '@/components/JustForYouProductCard'
import ProductCard from '@/components/ProductCard'
import ProfileSkeleton from '@/components/profile/ProfileSkeleton'
import UserHeader from '@/components/profile/UserHeader'
import TopProductAvatar from '@/components/TopProductAvatar'
import { useAuth } from '@/lib/contexts/auth-context'
import { useFetchProductPerUser, useFetchUserWishlist } from '@/services/products/queries'
import Link from 'next/link'
import React from 'react'

const page = () => {
  const {user} = useAuth();
  const {isError, isLoading, data: wishlist} = useFetchUserWishlist(user?.uid || '');

  return (
    <section className="w-full mt-6 relative overflow-x-hidden mb-[300px]">
        <h2 className='fon-raleway font-bold text-[28px] tracking-[-0.28px]'>Wishlist</h2>
        <div className="w-full mt-6">
            <div className="w-full flex items-center justify-between">
                <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Recently viewed</h3>
               <ArrowRightButton />
            </div>
          <div className="w-full flex items-center justify-between mt-4">
            <TopProductAvatar />
            <TopProductAvatar />
            <TopProductAvatar />
            <TopProductAvatar />
            <TopProductAvatar />
          </div>
      </div>
  
        <div className="w-full mt-6">
            <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Listed Items</h3>
            <div className="w-full flex justify-between flex-wrap">
            {wishlist && wishlist.length > 0 && wishlist.map((wishlist) => (
              <JustForYouProductCard product={wishlist.product} />
            ))}
            </div>
            {wishlist && wishlist.length === 0  && (
              <div className="w-full mt-6 flex flex-col items-center justify-center h-[50vh]">
              <h5 className='max-w-[300px] text-center text-[17px] font-semibold font-raleway mt-4'>No Item added to Wishlist yet</h5>
              <p className='max-w-[280px] text-center text-[12px] font-normal font-nunito-sans text-black/80 mt-2'>Items you add to Wishlist will appear here</p>
              <Link href='/' className='bg-dark-blue rounded-4xl px-4 py-2 text-white mt-4 cursor-pointer font-raleway'>Start Wishing</Link>
              </div>
            )}
            {isError && (
              <div className="w-full mt-6 flex flex-col items-center justify-center h-[50vh]">
              <p className='max-w-[280px] text-center text-[12px] font-normal font-nunito-sans text-black/80 mt-2'>Oops, failed to to load Wishlist. </p>
              <button className='bg-dark-blue rounded-4xl px-4 py-2 text-white mt-4 cursor-pointer font-raleway'>Go back</button>
              </div>
            )}
            {isLoading && (
              <ProfileSkeleton />
            )}
        </div>
        <div className="w-full mt-8">
            <div className="w-full flex items-center justify-between">
                <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Most Popular</h3>
                <Link className="flex items-center gap-3" href='/'>
                    <p className="text-[15px] font-raleway font-bold text-[#202020">See All</p>
                    <ArrowRightButton />
                </Link>
            </div>

            <div className="min-w-full mt-2">
            <div className="w-full overflow-x-auto flex items-start gap-1.5 carousel-container scrollbar-hide">
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
            </div>
            </div>
        </div>
    </section>
  )
}

export default page