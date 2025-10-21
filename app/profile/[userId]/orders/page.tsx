'use client'
import OrderCard from '@/components/profile/OrderCard'
import { useAuth } from '@/lib/contexts/auth-context'
import { useGetPendingOrders } from '@/services/payment/queries'
import React from 'react'

const page = () => {
    const {user} = useAuth();
    const {isLoading, isError, data: orders, error} = useGetPendingOrders(user?.uid || '')
  return (
    <section className='w-full'>
        {isLoading && (
            <div>
                loading...
            </div>
        )}
        {isError && (
            <div>
                {error.message}
            </div>
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