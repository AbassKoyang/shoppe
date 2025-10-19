'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import AddBankForm from '../components/AddBankForm';
import { useAuth } from '@/lib/contexts/auth-context';
import { Clipboard, Copy, PencilLine } from 'lucide-react';
import EmptyBankDetails from '../components/EmptyBankDetails';
import EditBankForm from '../components/EditBankForm';

const Page = () => {
    const [isModalOpen, setisModalOpen] = useState(false);
    const [isEditModalOpen, setisEditModalOpen] = useState(false);
    const {user, loading} = useAuth();
    return (
        <div className="w-full">
        <h4 className='text-[16px] font-medium font-raleway'>Bank Details</h4>
        {loading && (
            <div className='w-full p-4 rounded-xl bg-gray-200 mt-4'>
                <div className="w-full flex justify-between">
                    <div className="flex flex-col">
                        <div className='skeleton w-[120px] h-3 rounded-[6px]'></div>
                        <div className='skeleton w-[200px] h-8 rounded-[6px] mt-1'></div>
                    </div>
                    <div className='size-[16px] rounded-[6px] skeleton'></div>
                </div>
                <div className="w-full flex justify-between mt-3">
                    <div className="flex flex-col">
                        <div className='skeleton w-[120px] h-3 rounded-[6px]'></div>
                        <div className='skeleton w-[200px] h-8 rounded-[6px] mt-1'></div>
                    </div>
                    <div className='size-[16px] rounded-[6px] skeleton'></div>
                </div>
                <div className="w-full flex justify-between mt-3">
                    <div className="flex flex-col">
                        <div className='skeleton w-[120px] h-3 rounded-[6px]'></div>
                        <div className='skeleton w-[200px] h-8 rounded-[6px] mt-1'></div>
                    </div>
                    <div className='size-[16px] rounded-[6px] skeleton'></div>
                </div>
            </div>
        )}
        {user?.bankDetails ? (
            <div className='w-full p-4 rounded-xl bg-white mt-4 shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] relative'>
                <button onClick={() => setisEditModalOpen(true)} className="absolute top-3 right-3">
                <PencilLine className='size-[18px] text-dark-blue' />
                </button>
                <div className="w-full flex justify-between mt-3">
                    <div className="">
                        <span className='font-nunito-sans text-gray-500 text-[10px] font-light'>Account Holder</span>
                        <p className='font-raleway text-[#202020] text-[14px] font-medium'>{user.bankDetails.accountName}</p>
                    </div>
                    <button onClick={() => {
                        navigator.clipboard.writeText(user?.bankDetails?.accountName || '')
                    }}>
                     <Copy className='size-[16px] text-[#202020]' />
                    </button>
                </div>
                <div className="w-full flex justify-between">
                    <div className="">
                        <span className='font-nunito-sans text-gray-500 text-[10px] font-light'>Account Number</span>
                        <p className='font-raleway text-[#202020] text-[14px] font-medium'>{user.bankDetails.accountNumber}</p>
                    </div>
                    <button onClick={() => {
                        navigator.clipboard.writeText(user?.bankDetails?.accountNumber || '')
                    }}>
                     <Copy className='size-[16px] text-[#202020]' />
                    </button>
                </div>
                <div className="w-full flex justify-between">
                    <div className="">
                        <span className='font-nunito-sans text-gray-500 text-[10px] font-light'>Bank Name</span>
                        <p className='font-raleway text-[#202020] text-[14px] font-medium'>{user.bankDetails.bankName}</p>
                    </div>
                    <button onClick={() => {
                        navigator.clipboard.writeText(user?.bankDetails?.bankName || '')
                    }}>
                     <Copy className='size-[16px] text-[#202020]' />
                    </button>
                </div>
            </div>
        ) : loading === false ?  (
            <EmptyBankDetails openModal={() => setisModalOpen(true)}/>
        ) : null}

           <AddBankForm open={isModalOpen} closeModal={() => setisModalOpen(false)} />
           <EditBankForm open={isEditModalOpen} closeModal={() => setisEditModalOpen(false)} />
        </div>
    );
}

export default Page;