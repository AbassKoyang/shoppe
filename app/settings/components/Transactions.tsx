'use client';
import Link from 'next/link'
import React, { useEffect, useMemo } from 'react'
import { useGetNewProducts } from '@/services/products/queries';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import ArrowRightButton from '@/components/ArrowRightButton';
import ProductSkeleton from '@/components/ProductSkeleton';
import ProductCard from '@/components/ProductCard';
import HomeHeader from '@/components/HomeHeader';
import JustForYouProductCard from '@/components/JustForYouProductCard';
import { useRouter } from 'next/navigation';
import SponsoredBanner from '@/components/SponsoredBanner';
import { useGetTransactions } from '@/services/payment/queries';
import { useAuth } from '@/lib/contexts/auth-context';
import Transaction from './Transaction';
import TransactionSkeleton from './TransactionSkeleton';

const Transactions = () => {
    const {user} = useAuth();
    const { ref, inView } = useInView();

    const {
    data,
    fetchNextPage,
    hasNextPage,
    error,
    isFetchingNextPage,
    isLoading,
    isError,
    } = useGetTransactions(user?.uid || '');

    useEffect(() => {
        if (inView && hasNextPage) {
          fetchNextPage();
        }
      }, [inView, hasNextPage, fetchNextPage]);

    console.log(data);  

    const transactions = useMemo(() => {
        return data?.pages.flatMap(page => page.orders) ;
      }, [data]);

  return (
    <section className="w-full relative overflow-x-hidden overflow-y-auto h-[60vh] scrollbar-hide">
        {transactions && (
            <div className="w-full flex justify-between flex-wrap mt-4">        
            {transactions?.map((transaction) => (
                    <Transaction key={transaction.id} transaction={transaction} />
                ))}
            </div>
        )}
        {isLoading && (
            <div className="w-full flex justify-between flex-wrap mt-4">
                {Array.from({length: 10}).map((_, i) => (
                <TransactionSkeleton key={i}/>
                ))}
            </div>
        )}
        {isError && (
            <div className='flex items-center justify-center w-full h-[60vh]'>
            <p className='font-nunito-sans'>Oops, failed to fetch transactions.</p>
            </div>
        )}
         <div className='w-full h-[140px] flex items-center justify-center' ref={ref}>
                {isFetchingNextPage ? <LoaderCircle className="animate-spin size-[26px] text-dark-blue" /> : null}
         </div>
      </section>
  )
}

export default Transactions;