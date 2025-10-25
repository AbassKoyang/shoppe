'use client';
import { formatPrice, formatProductCardImageUrl } from '@/lib/utils';
import { OrderDataType } from '@/services/payment/types';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import React, { useState } from 'react';
import ArrowRightButton from '../ArrowRightButton';
import { defaultProfileAvatar } from '@/public/assets/images/exports';
import Image from 'next/image';
import { useAuth } from '@/lib/contexts/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MarkAsDeliveredModal from './MarkAsDeliveredModal';
import MarkAsDeliveredInProgressModal from './MarkAsDeliveredInProgressModal';
import MarkAsDeliveredSuccesfulModal from './MarkADeliveredSuccessFul';
import MarkAsDeliveredFailedModal from './MarkAsDeliveredFailedModal';


const SalesDetailsCard = ({order}:{order: OrderDataType}) => {
    const [isMarkAsDeliveredModal, setIsMarkAsDeliveredModal] = useState(false);
    const [isMarkAsDeliveredInProgress, setIsMarkAsDeliveredInProgress] = useState(false);
    const [markAsDeliveredSuccessful, setmarkAsDeliveredSuccessful] = useState(false);
    const [error, setError] = useState<{message: string; error: string} | null>(null);

    const {user} = useAuth();
    const router = useRouter();
    const viewportWidth = window.innerWidth;
    const productImageUrl = formatProductCardImageUrl(order.productDetails.images[0], {
        width: `${viewportWidth}`,
        ar_: '3:4',
        c_fill: true,
        g_auto: true,
        q_auto: true,
        f_auto: true,
        e_sharpen: true,
        dpr_auto: true,
     })
    const buyerImageUrl = formatProductCardImageUrl(order.buyerInfo.profile.imageUrl || '', {
        width: '150',
        ar_: '3:4',
        c_fill: true,
        g_auto: true,
        q_auto: true,
        f_auto: true,
        e_sharpen: true,
        dpr_auto: true,
     })

     const price = formatPrice(order.productDetails?.price.toString() || '', order.productDetails?.currency || '');
     const rawTs = order.createdAt ?? new Date();
    const resolvedDate = rawTs?.toDate ? rawTs.toDate() : (rawTs instanceof Date ? rawTs : new Date(rawTs));
    const orderDate = isNaN(resolvedDate?.getTime?.()) ? '' : resolvedDate.toLocaleString();
    const orderStatus = order.status ? order.status.substring(0,1).toUpperCase() +  order.status.substring(1) : '';


    const handleMarkOrderAsDelivered = async (userId: string, orderId: string) => {
        if (!userId || !orderId) {
          console.error('Missing required data:', { userId, orderId});
          alert('Missing required information');
          return;
        }
      
        console.log('Marking order:', {
          orderId,
          buyerId: userId,
        });
        setIsMarkAsDeliveredModal(false);
        setIsMarkAsDeliveredInProgress(true)    
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/orders/${orderId}/mark-as-delivered`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sellerId: userId,
              }),
            }
          );
    
          const data = await response.json();
    
          if (data.success) {
            setmarkAsDeliveredSuccessful(true)
            console.log(data);
          } else {
            console.log(data)
            setError(data);
          }
        } catch (error) {
          console.error('Marking as delivered error:', error);
        } finally {
          setIsMarkAsDeliveredInProgress(false);
        }
      };

  return (
    <div className="w-full rounded-xl bg-[#F8FAFF] shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] overflow-hidden mb-5">
        <div className="w-full px-3 py-2 flex items-center justify-between bg-[#F8FAFF]">
            <button onClick={() => router.back()}><ArrowLeft className='text-[#202020] size-[26px]'/></button>
            <div className="">
            <h5 className='font-raleway text-[16px] text-[#202020] font-medium'>#{order.id}</h5>
            <p className='font-nunito-sans text-[12px] text-gray-600 font-normal text-right'>Order details</p>
            </div>
        </div>
        <div className="w-full h-[400px] overflow-hidden">
            <img src={productImageUrl} alt="Product image" className='size-full object-center object-cover' />
        </div>
        <div className="w-full px-3 py-5 border-b border-b-gray-200">
            <div className="w-full flex items-center justify-between mb-5">
                <h4 className="text-[26px] text-black font-raleway font-extrabold">{price}</h4>
                <div className="flex gap-3">
                <div className="flex items-center gap-3">
                    <p className="text-[15px] font-raleway font-bold text-[#202020">View Product</p>
                    <ArrowRightButton />
                </div>
                </div>
            </div>
            <div className="w-full">
                <h5 className="text-[20px] text-black font-raleway font-bold leading-[1]">{order.productDetails.title}</h5>
                <p className="text-[15px] text-black font-nunito-sans font-normal mt-1">{order.productDetails.description}</p>
            </div>
        </div>
        <div className="w-full px-3 py-5 border-b border-b-gray-200 flex justify-between items-start">
            <div className="flex flex-col gap-1.5">
                <p className='font-nunito-sans text-[12px] text-gray-600 font-normal'>Ordered At</p>
                <h6 className='font-raleway text-[16px] text-[#202020] font-medium max-w-[120px]'>{orderDate}</h6>
            </div>
            <div className="flex flex-col gap-1.5">
                <p className='font-nunito-sans text-[12px] text-gray-600 font-normal'>Payment</p>
                <span className={`text-[14px] font-raleway font-normal bg-green-500 text-white py-0.5 px-3 rounded-sm`}>Paid</span>
            </div>
            <div className="flex flex-col gap-1.5">
                <p className='font-nunito-sans text-[12px] text-gray-600 font-normal'>Status</p>
                <span className={`text-[14px] font-raleway font-normal ${order.productDetails.status == 'sold' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'} py-0.5 px-3 rounded-sm`}>{orderStatus}</span>
            </div>
        </div>
        <div className="w-full px-3 pt-5 pb-2">
         <p className='font-nunito-sans text-[12px] text-gray-600 font-normal'>Buyer</p>
         <div className="w-full flex items-center justify-between">
            <div className=" max-w-[calc(100%-110px])]">
                <h6 className='font-raleway text-[16px] text-[#202020] font-medium'>{order.buyerInfo.profile.name}</h6>
                <a href={`https://${order.buyerInfo.profile.email}`} type='email' target='_blank' className='font-nunito-sans text-[14px] text-dark-blue font-normal'>{order.buyerInfo.profile.email}</a>
                {order.buyerInfo.shippingAddress.phoneNumber && (<h6 className='font-raleway text-[14px] text-[#202020] font-medium'>{order.buyerInfo.shippingAddress.phoneNumber}</h6>)}
                {order.buyerInfo.shippingAddress && (<h6 className='font-raleway text-[12px] text-[#202020] font-medium'>{order.buyerInfo.shippingAddress.address}, {order.buyerInfo.shippingAddress.city}, {order.buyerInfo.shippingAddress.country}</h6>)}
                <Link href={`/chat/${order.productDetails.id}_${order.buyerInfo.id}_${order.productDetails.sellerId}`} className="cursor-pointer bg-black rounded-4xl px-4 py-2 flex items-center gap-1.5 mt-3 w-fit"><MessageCircle  strokeWidth={2} className="text-white size-[18px]" /><span className="text-[14px] font-normal font-nunito-sans text-[#F3F3F3]">Chat Seller</span></Link>
            </div>
            <div className="size-[70px] rounded-lg overflow-hidden">
                <Image width={70} height={70} src={order.buyerInfo.profile.imageUrl ? buyerImageUrl : defaultProfileAvatar} alt="Seller image" className='size-full object-center object-cover' />
            </div>
         </div>
        </div>
        { order.status === 'pending' && (<div className="w-full px-3 pt-4 pb-2 bg-[#F8FAFF]">
        <button onClick={() => setIsMarkAsDeliveredModal(true)} className='w-full cursor-pointer bg-dark-blue hover:opacity-90 transition-all duration-200 ease-in-out text-[#F3F3F3] text-[22px] font-extralight flex items-center justify-center rounded-xl py-3 disabled:opacity-70 disabled:cursor-not-allowed'>Mark as Delivered</button>
       </div>)}
       <MarkAsDeliveredModal closeModal={() => setIsMarkAsDeliveredModal(false)} open={isMarkAsDeliveredModal} markAsDelivered={() => {handleMarkOrderAsDelivered(user?.uid || '', order.id || '')}} />
        <MarkAsDeliveredInProgressModal open={isMarkAsDeliveredInProgress} />
        <MarkAsDeliveredSuccesfulModal open={markAsDeliveredSuccessful} redirect={() => router.back()} closeModal={() => setmarkAsDeliveredSuccessful(false)} />
        <MarkAsDeliveredFailedModal open={error ? true : false} closeModal={() => setError(null)} error={error} tryAgain={() => {setError(null); handleMarkOrderAsDelivered(user?.uid || '', order.id || '')}} />
    </div>
  )
}

export default SalesDetailsCard