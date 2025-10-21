'use client';
import { formatPrice, formatProductCardImageUrl } from '@/lib/utils';
import { OrderDataType } from '@/services/payment/types';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import ArrowRightButton from '../ArrowRightButton';
import { defaultProfileAvatar } from '@/public/assets/images/exports';
import Image from 'next/image';

const OrderDetailsCard = ({order}:{order: OrderDataType}) => {
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
    const sellerImageUrl = formatProductCardImageUrl(order.sellerInfo.profile.imageUrl || '', {
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
    const orderStatus = order.productDetails.status ? order.productDetails.status.substring(0,1).toUpperCase() +  order.productDetails.status.substring(1) : '';

  return (
    <div className="w-full rounded-xl bg-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] overflow-hidden mb-5">
        <div className="w-full px-3 py-2 flex items-center justify-between bg-[#F8FAFF]">
            <button><ArrowLeft className='text-[#202020] size-[26px]'/></button>
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
            <div className="">
                <p className='font-nunito-sans text-[12px] text-gray-600 font-normal'>Ordered At</p>
                <h6 className='font-raleway text-[16px] text-[#202020] font-medium'>{orderDate}</h6>
            </div>
            <div className="">
                <p className='font-nunito-sans text-[12px] text-gray-600 font-normal'>Payment</p>
                <span className={`text-[14px] font-raleway font-normal bg-green-400 text-white py-0 px-3 rounded-2xl`}>Paid</span>
            </div>
            <div className="">
                <p className='font-nunito-sans text-[12px] text-gray-600 font-normal'>Status</p>
                <span className={`text-[14px] font-raleway font-normal ${order.productDetails.status == 'sold' ? 'bg-green-400 text-white' : 'bg-amber-400 text-white'} py-0 px-3 rounded-2xl`}>{orderStatus}</span>
            </div>
        </div>
        <div className="w-full px-3 py-5">
         <p className='font-nunito-sans text-[12px] text-gray-600 font-normal'>Seller</p>
         <div className="w-full flex items-center justify-between">
            <div className="">
                <h6 className='font-raleway text-[16px] text-[#202020] font-medium'>{order.sellerInfo.profile.name}</h6>
                <a href={`https://${order.sellerInfo.profile.email}`} type='email' target='_blank' className='font-nunito-sans text-[14px] text-dark-blue font-normal'>{order.sellerInfo.profile.email}</a>
                {order.sellerInfo.shippingAddress.phoneNumber && (<h6 className='font-raleway text-[16px] text-[#202020] font-medium'>{order.sellerInfo.shippingAddress.phoneNumber}</h6>)}
            </div>
            <div className="size-[70px] rounded-xl overflow-hidden">
                <Image width={70} height={70} src={order.sellerInfo.profile.imageUrl ? sellerImageUrl : defaultProfileAvatar} alt="Seller image" className='size-full object-center object-cover' />
            </div>
         </div>
        </div>
       <div className="w-full px-3 pt-4 pb-2 bg-[#F8FAFF]">
        <button className='w-full cursor-pointer bg-dark-blue hover:opacity-90 transition-all duration-200 ease-in-out text-[#F3F3F3] text-[22px] font-extralight flex items-center justify-center rounded-xl py-3 disabled:opacity-70 disabled:cursor-not-allowed'>Confirm Receival</button>
       </div>
    </div>
  )
}

export default OrderDetailsCard