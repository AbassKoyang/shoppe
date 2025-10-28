'use client';
import Link from 'next/link'
import React, { useEffect, useMemo } from 'react'
import ArrowRightButton from '../ArrowRightButton'
import { useGetPopularProducts } from '@/services/products/queries';
import { useInView } from 'react-intersection-observer';
import { LoaderCircle } from 'lucide-react';
import ProductCard from '../ProductCard';
import ProductSkeleton from '../ProductSkeleton';

const Discover = () => {
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
    <section className="w-full mt-8 mb-[100px]">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Discover</h3>
        </div>

        <div className="min-w-full mt-2">
        {products && (
            <div className="w-full overflow-x-auto flex items-start gap-1.5 carousel-container scrollbar-hide">
            {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            <div className='w-[140px] h-[140px] flex items-center justify-center' ref={ref}>
                {isFetchingNextPage ? <LoaderCircle className="animate-spin size-[26px] text-dark-blue" /> : null}
            </div>
             </div>
        )}
        {isLoading && (
            <div className="w-full overflow-x-auto flex items-start gap-1.5 carousel-container scrollbar-hide">
            {Array.from({length: 10}).map((_, i) => (
                <ProductSkeleton key={i}/>
            ))}
            <div className='w-fit h-full flex items-center justify-center' ref={ref}>
                {isFetchingNextPage ? <LoaderCircle className="animate-spin size-[26px] text-dark-blue" /> : null}
            </div>
             </div>
        )}
        {isError && (
            <div className='flex items-center justify-center w-full h-full'>
            <p className='font-nunito-sans'>Oops, failed to fetch items.</p>
            </div>
        )}
        </div>
      </section>
  )
}

export default Discover;