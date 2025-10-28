'use client';
import Link from 'next/link'
import React, { useEffect, useMemo } from 'react'
import { useGetPersonalizedProducts } from '@/services/products/queries';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import ArrowRightButton from '@/components/ArrowRightButton';
import ProductSkeleton from '@/components/ProductSkeleton';
import ProductCard from '@/components/ProductCard';
import HomeHeader from '@/components/HomeHeader';
import JustForYouProductCard from '@/components/JustForYouProductCard';
import { useRouter } from 'next/navigation';
import SponsoredBanner from '@/components/SponsoredBanner';

const page = () => {
    const { ref, inView } = useInView();
    const router = useRouter();

    const {
    data,
    fetchNextPage,
    hasNextPage,
    error,
    isFetchingNextPage,
    isLoading,
    isError,
    } = useGetPersonalizedProducts();

    useEffect(() => {
        if (inView && hasNextPage) {
          fetchNextPage();
        }
      }, [inView, hasNextPage, fetchNextPage]);

    console.log(data);  

    const products = useMemo(() => {
        return data?.pages.flatMap(page => page.products) ;
      }, [data]);

  return (
    <section className="w-full relative overflow-x-hidden mb-[300px]">
        <HomeHeader />
        <SponsoredBanner  />
        <div className="w-full flex items-center gap-3 mt-5">
          <button onClick={() => router.back()} className="flex items-center justify-center">
            <ArrowLeft className="size-[25px]" />
          </button>
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Just For You</h3>
        </div>

        {products && (
            <div className="w-full flex justify-between flex-wrap mt-2">        
            {products?.map((product) => (
                    <JustForYouProductCard key={product.id} product={product} />
                ))}
            </div>
        )}
        {isLoading && (
            <div className="w-full flex justify-between flex-wrap mt-3">
                {Array.from({length: 10}).map((_, i) => (
                <ProductSkeleton key={i}/>
                ))}
            </div>
        )}
        {isError && (
            <div className='flex items-center justify-center w-full h-full'>
            <p className='font-nunito-sans'>Oops, failed to fetch items.</p>
            </div>
        )}
         <div className='w-full h-[140px] flex items-center justify-center' ref={ref}>
                {isFetchingNextPage ? <LoaderCircle className="animate-spin size-[26px] text-dark-blue" /> : null}
         </div>
      </section>
  )
}

export default page;