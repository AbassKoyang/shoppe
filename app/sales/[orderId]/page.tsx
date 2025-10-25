'use client';
import OrderDetailsCard from '@/components/orders/OrderDetails';
import OrderDetailsSkeleton from '@/components/orders/OrderDetailsSkeleton';
import SalesDetailsCard from '@/components/sales/SalesDetails';
import { useGetOrderById } from '@/services/payment/queries';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

const page = () => {
    const params = useParams<{orderId: string}>()
    const orderId = params.orderId;
    const {isLoading, isError, data: order, error} = useGetOrderById(orderId || '');

  return (
    <section className='w-full overflow-x-hidden'>
       {isLoading && (
            <div className='w-full'>
              <OrderDetailsSkeleton />
            </div>
        )}
        {isError && (
            <div>
                {error.message}
            </div>
        )}
        {order && (
            <div className='w-full mt-3'>
                <SalesDetailsCard order={order} />
            </div>
        )}
    </section>
  )
}

export default page