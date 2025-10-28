'use client';
import Link from 'next/link'
import React, { useEffect, useMemo } from 'react'
import ArrowRightButton from '../ArrowRightButton'
import { useGetPersonalizedProducts } from '@/services/products/queries';
import { useInView } from 'react-intersection-observer';
import { LoaderCircle } from 'lucide-react';
import ProductCard from '../ProductCard';
import ProductSkeleton from '../ProductSkeleton';
import JustForYouProductCard from '../JustForYouProductCard';

const JustForYou = () => {
    const { ref, inView } = useInView();

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
    <section className="w-full mt-8">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Just For You</h3>
          <div className="flex items-center gap-3">
            <p className="text-[15px] font-raleway font-bold text-[#202020">See All</p>
            <ArrowRightButton url={`/just-for-you`} />
          </div>
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
            <p className='font-nunito-sans'>Oops, failed to fetch new items.</p>
            </div>
        )}
         <div className='w-full h-[140px] flex items-center justify-center' ref={ref}>
                {isFetchingNextPage ? <LoaderCircle className="animate-spin size-[26px] text-dark-blue" /> : null}
         </div>
      </section>
  )
}

export default JustForYou