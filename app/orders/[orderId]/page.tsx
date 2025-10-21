'use client';
import { useParams } from 'next/navigation';
import React from 'react';

const page = () => {
    const params = useParams()
    const orderId = params.orderId;
  return (
    <section>
        
    </section>
  )
}

export default page