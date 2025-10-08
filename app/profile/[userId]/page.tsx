'use client'
import JustForYouProductCard from '@/components/JustForYouProductCard'
import ProfileSkeleton from '@/components/profile/ProfileSkeleton'
import UserHeader from '@/components/profile/UserHeader'
import TopProductAvatar from '@/components/TopProductAvatar'
import { useAuth } from '@/lib/contexts/auth-context'
import { useFetchProductPerUser } from '@/services/products/queries'
import React from 'react'

const page = () => {
  const {user} = useAuth();
  const {isError, isLoading, data: products} = useFetchProductPerUser(user?.uid || '');

  return (
    <section className="w-full mt-6 relative overflow-x-hidden mb-[300px]">
        <UserHeader />
        <div className="w-full mt-6">
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Recently viewed</h3>
          <div className="w-full flex items-center justify-between mt-2">
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
            {products && products.length > 0 && products.map((product) => (
              <JustForYouProductCard product={product} />
            ))}
            </div>
            {products && products.length === 0  && (
              <div className="w-full mt-6 flex flex-col items-center justify-center h-[50vh]">
              <h5 className='max-w-[300px] text-center text-[17px] font-semibold font-raleway mt-4'>You haven't listed anything yet</h5>
              <p className='max-w-[280px] text-center text-[12px] font-normal font-nunito-sans text-black/80 mt-2'>Let go of what you don't use anymore</p>
              <button className='bg-dark-blue rounded-4xl px-4 py-2 text-white mt-4 cursor-pointer font-raleway'>Start Selling</button>
              </div>
            )}
            {isError && (
              <div className="w-full mt-6 flex flex-col items-center justify-center h-dvh">
              <p className='max-w-[280px] text-center text-[12px] font-normal font-nunito-sans text-black/80 mt-2'>Oops, failed to to load listed items. </p>
              <button className='bg-dark-blue rounded-4xl px-4 py-2 text-white mt-4 cursor-pointer font-raleway'>Go back</button>
              </div>
            )}
            {isLoading && (
              <ProfileSkeleton />
            )}
        </div>
    </section>
  )
}

export default page