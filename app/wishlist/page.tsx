'use client'
import ArrowRightButton from '@/components/ArrowRightButton'
import PopularProducts from '@/components/home-page/PopularProducts'
import JustForYouProductCard from '@/components/JustForYouProductCard'
import ProductCard from '@/components/ProductCard'
import ProfileProductCardSkeleton from '@/components/profile/ProfileProductCardSkeleton'
import UserHeader from '@/components/profile/UserHeader'
import TopProductAvatar from '@/components/TopProductAvatar'
import EmptyWishlist from '@/components/wishlist/EmptyWishlist'
import RecentlyViewedProductsPreview from '@/components/wishlist/RecentlyViewedProductsPreview'
import WishlistProductCard from '@/components/wishlist/WishlistProductCard'
import { useAuth } from '@/lib/contexts/auth-context'
import { useFetchUserWishlist } from '@/services/products/queries'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
  const {user} = useAuth();
  const {isError, isLoading, data: wishlist} = useFetchUserWishlist(user?.uid || '');
  const router = useRouter()

  return (
    <section className="w-full mt-4 relative overflow-x-hidden mb-[300px]">
      <div className="w-full flex items-center gap-3">
        <button onClick={() => router.back()} className="flex items-center justify-center cursor-pointer">
            <ArrowLeft className="size-[30px]" />
        </button>
        <h2 className='font-raleway font-bold text-[28px] tracking-[-0.28px] leading-[1px]'>Wishlist</h2>
      </div>
        <RecentlyViewedProductsPreview />
  
        <div className="w-full mt-3">
            <div className="w-full flex justify-between flex-wrap">
            {wishlist && wishlist.length > 0 && wishlist.map((wishlist) => (
              <WishlistProductCard product={wishlist.product} />
            ))}
            </div>
            {wishlist && wishlist.length === 0  && (
              <EmptyWishlist />
            )}
            {isError && (
              <div className="w-full mt-6 flex flex-col items-center justify-center h-[50vh]">
              <p className='max-w-[280px] text-center text-[12px] font-normal font-nunito-sans text-black/80 mt-2'>Oops, failed to to load Wishlist. </p>
              <button className='bg-dark-blue rounded-4xl px-4 py-2 text-white mt-4 cursor-pointer font-raleway'>Go back</button>
              </div>
            )}
            {isLoading && (
              <ProfileProductCardSkeleton />
            )}
        </div>

            <PopularProducts />
    </section>
  )
}

export default page;