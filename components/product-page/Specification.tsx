'use client';
import { formatPrice } from '@/lib/utils';
import { ProductType } from '@/services/products/types'
import { BadgeCheck, CalendarPlus, MapPin, Package, PackageOpen, Palette, PenLine, Ruler, TicketPercent, User, WashingMachine } from 'lucide-react';
import React from 'react'
import { BiMaleFemale } from 'react-icons/bi';
import { IoIosShareAlt } from 'react-icons/io'
import { MdOutlineCategory } from 'react-icons/md'
import { GiWool } from "react-icons/gi";
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';


const Specification = ({product}:{product: ProductType | null}) => {
    const {user} = useAuth();
    const price = formatPrice(product?.price.toString() || '', product?.currency || '');
    const date = new Date(product?.createdAt || '').toDateString();

  return (
    <div className="px-4 [@media(min-width:375px)]:px-6 bg-white">
    <div className="w-full flex items-center justify-between my-5">
      <h4 className="text-[26px] text-black font-raleway font-extrabold">{price}</h4>
      <button className="size-[43px] flex items-center justify-center bg-[#FFEBEB] rounded-full cursor-pointer">
      <IoIosShareAlt className="size-[22px] text-[#B5A2A2]" />
      </button>
    </div>
    <div className="w-full">
      <h5 className="text-[20px] text-black font-raleway font-bold leading-[1]">{product?.title}</h5>
      <p className="text-[15px] text-black font-nunito-sans font-normal mt-1">{product?.description}</p>
    </div>
    <div className="w-full my-5">
     <h5 className="text-[20px] text-black font-raleway font-extrabold ">Specifications</h5>
    <div className="w-full flex flex-wrap justify-between items-start">

      <div className="w-[50%] flex items-start justify-start gap-1.5 mt-5">
        <MdOutlineCategory className='text-gray-600 size-[14px]' />
        <div className="">
            <p className="text-[12px] text-gray-600 font-raleway font-normal leading-[1]">Category</p>
            <span className="text-[16px] text-black font-raleway font-semibold py-0.5 mt-1">{product?.category}</span>
        </div>
      </div>

      <div className="w-[50%] flex items-start justify-start gap-1.5 mt-5">
        <MdOutlineCategory className='text-gray-600 size-[14px]' />
        <div className="">
            <p className="text-[12px] text-gray-600 font-raleway font-normal leading-[1]">Sub Category</p>
            <span className="text-[16px] text-black font-raleway font-semibold py-0.5 mt-1">{product?.subCategory}</span>
        </div>
      </div>

      <div className="w-[50%] flex items-start justify-start gap-1.5 mt-5">
        <Ruler className='text-gray-600 size-[14px]' />
        <div className="">
            <p className="text-[12px] text-gray-600 font-raleway font-normal leading-[1]">Size</p>
            <span className="text-[16px] text-black font-raleway font-semibold py-0.5 mt-1">{product?.size}</span>
        </div>
      </div>

      <div className="w-[50%] flex items-start justify-start gap-1.5 mt-5">
        {product?.condition == 'new' ? <Package className='text-gray-600 size-[14px]' /> : <PackageOpen className='text-gray-600 size-[14px]' />}
        <div className="">
            <p className="text-[12px] text-gray-600 font-raleway font-normal leading-[1]">Condition</p>
            <span className="text-[16px] text-black font-raleway font-semibold py-0.5 mt-1">{product?.condition == 'new' ? 'New' : 'Used'}</span>
        </div>
      </div>

      <div className="w-[50%] flex items-start justify-start gap-1.5 mt-5">
        <TicketPercent className='text-gray-600 size-[14px]' />
        <div className="">
            <p className="text-[12px] text-gray-600 font-raleway font-normal leading-[1]">Discount</p>
            <span className="text-[16px] text-black font-raleway font-semibold py-0.5 mt-1">{product?.discount}%</span>
        </div>
      </div>


      {product?.gender && (
        <div className="w-[50%] flex items-start justify-start gap-1.5 mt-5">
            <BiMaleFemale className='text-gray-600 size-[14px]' />
            <div className="">
                <p className="text-[12px] text-gray-600 font-raleway font-normal leading-[1]">Gender</p>
                <span className="text-[16px] text-black font-raleway font-semibold py-0.5 mt-1">{product?.gender}</span>
            </div>
        </div>
      )}

      {product?.material && (
        <div className="w-[50%] flex items-start justify-start gap-1.5 mt-5">
            <WashingMachine className='text-gray-600 size-[14px]' />
            <div className="">
                <p className="text-[12px] text-gray-600 font-raleway font-normal leading-[1]">Material</p>
                <span className="text-[16px] text-black font-raleway font-semibold py-0.5 mt-1">{product?.material}</span>
            </div>
        </div>
      )}

      {product?.brand && (
        <div className="w-[50%] flex items-start justify-start gap-1.5 mt-5">
            <BadgeCheck className='text-gray-600 size-[14px]' />
            <div className="">
                <p className="text-[12px] text-gray-600 font-raleway font-normal leading-[1]">Brand</p>
                <span className="text-[16px] text-black font-raleway font-semibold py-0.5 mt-1">{product?.brand}</span>
            </div>
        </div>
      )}

      {product?.color && (
        <div className="w-[50%] flex items-start justify-start gap-1.5 mt-5">
            <Palette className='text-gray-600 size-[14px]' />
            <div className="">
                <p className="text-[12px] text-gray-600 font-raleway font-normal leading-[1]">Color</p>
                <span className="text-[16px] text-black font-raleway font-semibold py-0.5 mt-1">{product?.color}</span>
            </div>
        </div>
      )}

      {product?.location && (
        <div className="w-[50%] flex items-start justify-start gap-1.5 mt-5">
            <MapPin className='text-gray-600 size-[14px]' />
            <div className="">
                <p className="text-[12px] text-gray-600 font-raleway font-normal leading-[1]">Location</p>
                <span className="text-[16px] text-black font-raleway font-semibold py-0.5 mt-1">{product?.location}</span>
            </div>
        </div>
      )}
    </div>
    </div>
    <div className="w-full py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <CalendarPlus className='text-black size-[16px]' />
            <h3 className='text-black font-raleway text-[16px]'>{date}</h3>
        </div>

        {user?.uid === product?.sellerId && (
            <div className=" flex flex-col items-center justify-center">
            <Link href={`/edit-product/${product?.id}`} className={`size-[30px] rounded-full bg-dark-blue flex items-center justify-center cursor-pointer`}>
                <PenLine className="text-white size-[14px]" />
            </Link>
            <p className="font-nunito-sans text-black font-normal text-[10px] mt-1">Edit Product</p>
            </div>
           )}
    </div>
  </div>
  )
}

export default Specification