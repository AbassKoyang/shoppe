'use client'
import { useAuth } from '@/lib/contexts/auth-context';
import { formatPrice } from '@/lib/utils';
import { OrderDataType, TransactionType } from '@/services/payment/types';
import React from 'react';

const Transaction = ({transaction}: {transaction: OrderDataType}) => {
    const {user} = useAuth()
    const price : string = String(transaction.transactionDetails.sellerId === user?.uid ? transaction.transactionDetails.sellerAmount : transaction.transactionDetails.amount);
    const rawTs = transaction.createdAt;
    const resolvedDate = rawTs?.toDate ? rawTs.toDate() : (rawTs instanceof Date ? rawTs : new Date(rawTs));
    const date = isNaN(resolvedDate?.getTime?.()) ? '' : resolvedDate.toDateString().substring(0,11);
    const amount = formatPrice(price, transaction.productDetails.currency || '');

  return (
    <div className='w-full px-5 py-4 rounded-[14px] bg-[#F1F4FE] flex items-center justify-between'>
        <div className="flex gap-4 items-center">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.17241 5.12598H15.8276C16.6846 5.12598 17.3793 5.81727 17.3793 6.67003L18 18.4048C18 19.2576 17.3053 19.9489 16.4483 19.9489H1.55172C0.69473 19.9489 0 19.2576 0 18.4048L0.620689 6.67003C0.620689 5.81727 1.31542 5.12598 2.17241 5.12598Z" fill={transaction.transactionDetails.sellerId === user?.uid ? '#004CFF' : '#D97474'}/>
            <path d="M4.39801 8.50448V4.11865C4.39801 2.39627 5.78448 1 7.49478 1H10.3128C12.0231 1 13.4095 2.39627 13.4095 4.11865V8.50448" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M4.39801 4.71268V4.11865C4.39801 2.39627 5.78448 1 7.49478 1H10.3128C12.0231 1 13.4095 2.39627 13.4095 4.11865V4.71268" stroke={transaction.transactionDetails.sellerId === user?.uid ? '#004CFF' : '#D97474'}stroke-width="2" stroke-linecap="round"/>
            </svg>

            <div className="">
                <p className='font-nunito-sans font-semibold text-[10px] text-black'>{date}</p>
                <h5 className='font-raleway font-bold text-[14px] text-[#202020] tracking-[-0.14px] leading-[1px] mt-1'>Order <span className='text-[10px]'>#{transaction.id}</span></h5>
            </div>
        </div>

        <div className="">
         <h5 className={`font-raleway font-bold text-[17px] tracking-[-0.17px] ${transaction.transactionDetails.sellerId === user?.uid ? 'text-[#202020]' : 'text-[#D97474]'}`}>{transaction.transactionDetails.sellerId === user?.uid ? `+${amount}` : `-${amount}`}</h5>
        </div>
    </div>
  )
}

export default Transaction