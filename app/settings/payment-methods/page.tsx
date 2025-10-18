'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import React, { useState } from 'react'
import AddPaymentMethodButton from '../components/AddPaymentMethodButton';
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Settings } from 'lucide-react';
import Image from 'next/image';
import { visaLogo } from '@/public/assets/images/exports';
import AddPaymentMethodForm from '../components/AddPaymentMethodForm';
import { useAuth } from '@/lib/contexts/auth-context';
import EditPaymentMethodForm from '../components/EditPaymentMethod';
import { paymentMethodType } from '@/services/payment/types';
import { usePaymentMethods } from '@/services/payment/queries';
import CardCarouselItem from '../components/CardCarouselItem';


const PaymentMethodsPage = () => {
    const {user} = useAuth();
    const { data: paymentMethods = [], isLoading, error } = usePaymentMethods(user?.uid || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    );
    

  return (
    <ProtectedRoute>
        <section className='w-full'>
        <h4 className='text-[16px] font-medium font-raleway'>Payment Methods</h4>
            <div className='w-full flex items-center mt-4'>
                {error && (
                    <p>Failed to load cards</p>
                )}

                {isLoading && (
                    <div className='w-[88%] h-[155px] rounded-xl animate-pulse'></div>
                )}
                {paymentMethods && (
                    <Carousel
                    plugins={[plugin.current]}
                    className="w-[88%]  h-[155px]"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent className='w-full h-[155px]'>
                            {paymentMethods.map((paymentMethod) => (
                            <CardCarouselItem paymentMethod={paymentMethod} key={paymentMethod.id} />
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}
                <AddPaymentMethodButton openModal={() => setIsAddModalOpen(true)} />
            </div>
            <AddPaymentMethodForm  open = {isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} />
        </section>
    </ProtectedRoute>
  )
};
export default PaymentMethodsPage