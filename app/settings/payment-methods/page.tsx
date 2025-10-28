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
import Transactions from '../components/Transactions';
import CreditCardSkeleton from '../components/CreditCardSkeleton';


const PaymentMethodsPage = () => {
    const {user} = useAuth();
    const { data: paymentMethods, isLoading, error } = usePaymentMethods(user?.uid || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<paymentMethodType>();

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
                   <CreditCardSkeleton />
                )}
                {paymentMethods && paymentMethods.length == 0 && (
                    <div className='w-[88%] h-[155px] flex items-center justify-center'>
                        <p className='font-nunito-sans'>No card added yet.</p>
                    </div>
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
                            <CardCarouselItem openModal={() => {setSelectedPaymentMethod(paymentMethod); setIsEditModalOpen(true); }} paymentMethod={paymentMethod} key={paymentMethod.id} />
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}
                <AddPaymentMethodButton openModal={() => setIsAddModalOpen(true)} />
            </div>
            <Transactions />
            <AddPaymentMethodForm  open = {isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} />
            <EditPaymentMethodForm paymentMethod={selectedPaymentMethod || {id: '', userId: '', cardHolder: '', brand: '', last4: '', expiryMonth: '', expiryYear: '', email: '', authorisationCode: '', createdAt: '',}} open = {isEditModalOpen} closeModal={() => setIsEditModalOpen(false)} />
        </section>
    </ProtectedRoute>
  )
};
export default PaymentMethodsPage