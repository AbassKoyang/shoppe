'use client';
import Link from 'next/link'
import React, { useEffect, useMemo } from 'react'
import ArrowRightButton from '../ArrowRightButton'
import { useGetPopularProducts } from '@/services/products/queries';
import { useInView } from 'react-intersection-observer';
import { LoaderCircle } from 'lucide-react';
import ProductCard from '../ProductCard';
import ProductSkeleton from '../ProductSkeleton';
import TopProductAvatar from '../TopProductAvatar';

const TopProducts = () => {
    const { ref, inView } = useInView();

    const {
    data,
    fetchNextPage,
    hasNextPage,
    error,
    isFetchingNextPage,
    isLoading,
    isError,
    } = useGetPopularProducts();

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
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Top Products</h3>

        {products && (
         <div className="w-full flex items-center justify-between mt-2">
            {products?.map((product) => (
                <TopProductAvatar product={product} />
            ))}
                <div className='w-[140px] h-[140px] flex items-center justify-center' ref={ref}>
                    {isFetchingNextPage ? <LoaderCircle className="animate-spin size-[26px] text-dark-blue" /> : null}
                </div>
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
            <p className='font-nunito-sans'>Oops, failed to fetch top products.</p>
            </div>
        )}
      </section>
  )
}

export default TopProducts;