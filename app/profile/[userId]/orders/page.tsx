'use client'
import EmptyOrders from '@/components/profile/EmptyOrders'
import OrderCard from '@/components/profile/OrderCard'
import OrderCardSkeleton from '@/components/profile/OrderCardSkeleton'
import { useAuth } from '@/lib/contexts/auth-context'
import { useGetPendingOrders } from '@/services/payment/queries'
import React from 'react'

const page = () => {
    const {user} = useAuth();
    const {isLoading, isError, data: orders, error} = useGetPendingOrders(user?.uid || '')
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
           <p className='font-nunito-sans'>Oops, Failed to load orders.</p>
           </div>
        )}
        {orders && orders.length === 0  && (
              <EmptyOrders title="You've no pending order" desc='Orders that are yet to be received will appear here' />
        )}
        {orders && (
            <div className='w-full mt-3'>
                {orders.map((order) => (
                    <OrderCard order={order} />
                ))}
            </div>
        )}
    </section>
  )
}

export default page