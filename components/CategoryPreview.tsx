'use client';
import { useFetchProductCategoryCount } from '@/services/products/queries';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const CategoryPreview = ({label, images} : {label: string; images: string[]}) => {
    const {isLoading, isError, data: productCount} = useFetchProductCategoryCount(label);
    const router = useRouter();
  return (
        <>
            {isLoading && (
                <div className='pointer w-[49%] h-[220px] bg-gray-200 rounded-[9px] grid grid-cols-2 grid-rows-2 gap-1.5 p-1.5 shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] mb-1'>
                    <div className="col-span-1 row-span-1 rounded-[5px] bg-gray-300 animate-pulse"></div>
                    <div className="col-span-1 row-span-1 rounded-[5px] bg-gray-300 animate-pulse"></div>
                    <div className="col-span-1 row-span-1 rounded-[5px] bg-gray-300 animate-pulse"></div>
                    <div className="col-span-1 row-span-1 rounded-[5px] bg-gray-300 animate-pulse"></div>
                </div>
            )}

            {isError && (
                <div className='w-full h-full flex items-center justify-center'>
                    <p>Failed to load category.</p>
                </div>
            )}
            {!isError && !isLoading && (
                <button onClick={() => router.push(`/categories/${label}`)} className='cursor-pointer w-[49%] h-[220px] rounded-[9px] p-1.5 shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] mb-1'>
                <div className="w-full h-[83%] grid grid-cols-2 grid-rows-2 gap-1">
                    <div className="col-span-1 row-span-1 gap-1 rounded-[5px] object-center object-contain overflow-hidden">
                        <img className='size-full' src="/assets/images/clothing-1.png" alt="clothing picture" />
                    </div>
                    <div className="col-span-1 row-span-1 gap-1 rounded-[5px] object-center object-contain overflow-hidden">
                        <img className='size-full' src="/assets/images/clothing-3.png" alt="clothing picture" />
                    </div>
                    <div className="col-span-1 row-span-1 gap-1 rounded-[5px] object-center object-contain overflow-hidden">
                        <img className='size-full' src="/assets/images/clothing-3.png" alt="clothing picture" />
                    </div>
                    <div className="col-span-1 row-span-1 gap-1 rounded-[5px] object-center object-contain overflow-hidden">
                        <img className='size-full' src="/assets/images/clothing-1.png" alt="clothing picture" />
                    </div>
                </div>
    
                <div className="w-full h-[17%] flex items-end justify-between">
                        <h5 className='text-[#202020] text-[19px] font-bold font-raleway'>{label}</h5>
                    <span className='px-3 py-1 rounded-md bg-[#DFE9FF] text-xs font-bold text-[#202020]'>{productCount || 0}</span>
                </div>
                </button>
            )}
        </>
  )
}

export default CategoryPreview;