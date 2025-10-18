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


const PaymentMethodsPage = () => {
    const {user} = useAuth();
    const { data: paymentMethods = [], isLoading, error } = usePaymentMethods(user?.uid || '');
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
                            {paymentMethods.map((paymentMethod, index) => (
                            <CarouselItem className='w-full h-full rounded-xl overflow-hidden' key={index}>
                                <Card className='bg-[#F1F4FE] h-full p-0'>
                                    <CardContent className="size-full flex flex-col justify-between p-4 pb-6">
                                        <div className='w-full flex items-center justify-between'>
                                            <img src='/assets/images/visa-logo.png' alt="Visa Logo" />
                                            <button onClick={() =>{
                                                setSelectedPaymentMethod(paymentMethod)
                                                setIsEditModalOpen(true)}} className='cursor-pointer size-[35px] flex items-center justify-center bg-[#E5EBFC] rounded-full'>
                                                <Settings className='text-dark-blue size-[14px]' />
                                            </button>
                                        </div>
                                        <div className='w-full flex flex-col items-center'>
                                            <div className='w-full flex items-center justify-between text-[#202020]'>
                                                <div className='flex items-center gap-1.5'>
                                                    <span>*</span>
                                                    <span>*</span>
                                                    <span>*</span>
                                                    <span>*</span>
                                                </div>
                                                <div className='flex items-center gap-1.5'>
                                                    <span>*</span>
                                                    <span>*</span>
                                                    <span>*</span>
                                                    <span>*</span>
                                                </div>
                                                <div className='flex items-center gap-1.5'>
                                                    <span>*</span>
                                                    <span>*</span>
                                                    <span>*</span>
                                                    <span>*</span>
                                                </div>
                                                <p>{paymentMethod.last4}</p>
                                            </div>
                                            <div className='w-full flex items-center justify-between mt-2'>
                                                <p className='text-[#202020] font-nunito-sans font-semibold text-[12px]'>{paymentMethod.cardHolder}</p>
                                            <p className='text-[#202020] font-nunito-sans font-semibold text-[12px]'>{`${paymentMethod.expiryMonth}/${paymentMethod.expiryYear}`}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}
                <AddPaymentMethodButton openModal={() => setIsAddModalOpen(true)} />
            </div>
            <AddPaymentMethodForm  open = {isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} />
            <EditPaymentMethodForm paymentMethod={selectedPaymentMethod || { id: '', userId: '', cardHolder: '', brand: '', last4: '', expiryDate: '', cvv: '', token: '', createdAt: ''}} open = {isEditModalOpen} closeModal={() => setIsEditModalOpen(false)} />
        </section>
    </ProtectedRoute>
  )
};
export default PaymentMethodsPage