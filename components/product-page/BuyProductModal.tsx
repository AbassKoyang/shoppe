'use client';
import React, { useState } from 'react'
import {motion} from 'framer-motion'
import { useAuth } from '@/lib/contexts/auth-context';
import { BiSolidPencil } from 'react-icons/bi';
import { usePaymentMethods } from '@/services/payment/queries';
import CardCon from './Card';
import { Plus } from 'lucide-react';
import AddPaymentMethodForm from '@/app/settings/components/AddPaymentMethodForm';
import UpdateShippingAddressModal from './UpdateShippingAddressModal';
import { paymentMethodType } from '@/services/payment/types';

const BuyProductModal = ({open, closeModal, setSelectedCard, selectedCard, buyProduct}: {open: boolean; selectedCard: paymentMethodType; closeModal: () => void; setSelectedCard: (card: paymentMethodType) => void; buyProduct: () => void}) => {
    const {user} = useAuth();
    const { data: paymentMethods, isLoading, error } = usePaymentMethods(user?.uid || '');
    const [isAddModalOpen, setisAddModalOpen] = useState(false);
    const [isShippingAddressModalOpen, setIsShippingAddressModalOpen] = useState(false);

  return (
    <motion.div 
    initial={{ y: '100%' }}
    animate={{ y: open ? '0%' : '100%' }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className={`h-dvh w-[100vw] fixed top-0 left-0 bg-transparent flex flex-col justify-between z-100`}>

        <div onClick={() => closeModal()} className='z-10 absolute top-0 left-0 w-full h-full bg-white/35 backdrop-blur-sm'></div>


        <div className="w-full p-6 z-20">
            <div className="w-full p-3 flex items-center justify-between rounded-[10px] bg-white">
                <div className="w-full">
                    <h5 className='font-raleway font-bold text-[18px] tracking-[-0.14px] text-[#202020] max-w-[80%]'>Shipping Address</h5>
                    <p className='font-nunito-sans font-regular text-[14px] max-w-[80%]'>{user?.shippingAddress.address}</p>
                </div>
                <button onClick={() => setIsShippingAddressModalOpen(true)} className='size-[40px] flex items-center justify-center bg-dark-blue rounded-full cursor-pointer'><BiSolidPencil className='size-[18px] text-white' /></button>
            </div>
        </div>


        <div className='z-20 w-full bg-[#F8FAFF] rounded-t-2xl py-6 oveflow-x-hidden'>
            <h3 className='text-[22px] font-raleway font-bold mb-6 ml-6'>Payment Methods</h3>
            <div className="bg-white w-full oveflow-x-hidden">
                <div className="w-full flex items-center gap-5 p-6 overflow-x-auto card-carousel-container scrollbar-hide">
                    {paymentMethods && paymentMethods.map((paymentMethod) => (
                        <CardCon paymentMethod={paymentMethod} selectedCard={selectedCard} setSelectedCard={setSelectedCard}/>
                    ))}
                    <button onClick={() => setisAddModalOpen(true)} className='cursor-pointer min-w-[45px] h-[155px] bg-dark-blue rounded-xl flex justify-center items-center'>
                        <Plus fill='white' className='text-white' />
                    </button>
                </div>

                <div className="w-full px-6">
                 <button onClick={buyProduct} disabled={selectedCard.id === ''} className='w-full cursor-pointer bg-dark-blue hover:opacity-90 transition-all duration-200 ease-in-out text-[#F3F3F3] text-[22px] font-extralight flex items-center justify-center rounded-xl py-3 disabled:opacity-70 disabled:cursor-not-allowed'>Proceed</button>
                </div>
            </div>
        </div>
        <AddPaymentMethodForm open={isAddModalOpen} closeModal={() => setisAddModalOpen(false)} />
        <UpdateShippingAddressModal open={isShippingAddressModalOpen} closeModal={() => setIsShippingAddressModalOpen(false)} />
    </motion.div> 
)
}

export default BuyProductModal