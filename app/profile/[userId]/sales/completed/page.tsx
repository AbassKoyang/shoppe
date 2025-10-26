'use client'
import EmptySales from '@/components/profile/EmptySales'
import OrderCardSkeleton from '@/components/profile/OrderCardSkeleton'
import SalesCard from '@/components/profile/SalesCard'
import { useAuth } from '@/lib/contexts/auth-context'
import { useGetCompletedSales} from '@/services/payment/queries'
import React from 'react'

const page = () => {
    const {user} = useAuth();
    const {isLoading, isError, data: orders, error} = useGetCompletedSales(user?.uid || '')
  return (
    <section className='w-full'>
        {isLoading && (
            <div className='w-full mt-3'>
                <OrderCardSkeleton />
                <OrderCardSkeleton />
                <OrderCardSkeleton />
                <OrderCardSkeleton />
                <OrderCardSkeleton />
            </div>
        )}
        {isError && (
           <div className='w-full h-[60vh] flex items-center justify-center'>
           <p className='font-nunito-sans'>Oops, Failed to load sales.</p>
           </div>
        )}
        {orders && orders.length === 0  && (
            <EmptySales title="You've not made completed sale yet" desc="Items you've sold will appear here" />
        )}
        {orders && (
            <div className='w-full mt-3'>
                {orders.map((order) => (
                    <SalesCard order={order} />
                ))}
            </div>
        )}
    </section>
  )
}

export default page