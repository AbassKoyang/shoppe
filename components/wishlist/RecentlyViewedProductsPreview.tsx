'use client';
import Link from 'next/link'
import React, { useEffect, useMemo } from 'react'
import ArrowRightButton from '../ArrowRightButton'
import { useInView } from 'react-intersection-observer';
import { LoaderCircle } from 'lucide-react';
import ProductCard from '../ProductCard';
import ProductSkeleton from '../ProductSkeleton';
import TopProductAvatar from '../TopProductAvatar';
import { useGetRecentlyViewed } from '@/services/products/queries';
import { useAuth } from '@/lib/contexts/auth-context';

const RecentlyViewedProductsPreview = () => {
    const {user} = useAuth();
    const {
    data: recentlyViewed,
    isLoading,
    isError,
    } = useGetRecentlyViewed(user?.uid ||  '');


  return (
    <section className="w-full mt-4">
          <div className="w-full flex items-center justify-between">
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Recently Viewed</h3>
          <div className="flex items-center gap-3">
            <p className="text-[15px] font-raleway font-bold text-[#202020">See All</p>
            <ArrowRightButton url={`/recently-viewed`} />
          </div>
        </div>

        {recentlyViewed && (
         <div className="w-full flex items-center justify-between mt-2">
            {recentlyViewed?.map((recviewed) => (
                <TopProductAvatar product={recviewed.product} />
            ))}
             </div>
        )}
        {isLoading && (
         <div className="w-full flex items-center justify-between mt-2">
            {Array.from({length: 5}).map((_, i) => (
                <div className='size-[50px] rounded-full skeleton' key={i}></div>
            ))}
             </div>
        )}
        {isError && (
            <div className='flex items-center justify-center w-full h-full mt-2'>
            <p className='font-nunito-sans'>Oops, failed to fetch recently viewed.</p>
            </div>
        )}
      </section>
  )
}

export default RecentlyViewedProductsPreview;