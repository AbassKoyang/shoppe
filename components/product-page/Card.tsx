'use client'
import React, { useState } from 'react'
import { CardContent, Card } from '../ui/card'
import { Settings } from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth-context'
import { paymentMethodType } from '@/services/payment/types'
import EditPaymentMethodForm from '@/app/settings/components/EditPaymentMethod'
import { BsCheck } from 'react-icons/bs'

const CardCon = ({paymentMethod, selectedCard, setSelectedCard}:{paymentMethod: paymentMethodType; selectedCard: paymentMethodType; setSelectedCard: (card: paymentMethodType) => void}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isSelectedCard = selectedCard.id === paymentMethod.id;
  return (
    <div onClick={() => setSelectedCard(paymentMethod)} className="min-w-[280px] h-[155px] relative">
        <span className={`${isSelectedCard ? 'size-[22px] border-2' : 'size-0 border-0'} bg-dark-blue rounded-full flex items-center justify-between absolute -top-1 -right-1 z-20 transition-all duration-300 ease-in-out origin-center`}>
            <BsCheck className="text-white" />
        </span>
         <Card className='w-full bg-[#F1F4FE] h-full p-0'>
            <CardContent className="size-full flex flex-col justify-between p-4 pb-6">
                <div className='w-full flex items-center justify-between'>
                    <img src='/assets/images/visa-logo.png' alt="Visa Logo" />
                    <button onClick={() => setIsModalOpen(true)} className='cursor-pointer size-[35px] flex items-center justify-center bg-[#E5EBFC] rounded-full'>
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
        <EditPaymentMethodForm paymentMethod={paymentMethod} open={isModalOpen} closeModal={() => setIsModalOpen(false)} />
    </div>
)
}

export default CardCon