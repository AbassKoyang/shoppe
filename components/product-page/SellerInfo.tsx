import { defaultProfileAvatar } from '@/public/assets/images/exports';
import { useFetchProductPerUser } from '@/services/products/queries';
import { useFetchUserById } from '@/services/users/queries';
import { Calendar, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import ArrowRightButton from '../ArrowRightButton';

const SellerInfo = ({sellerId}: {sellerId: string}) => {
    const {isError: iserror, isLoading: isloading, data: seller} = useFetchUserById(sellerId);
    const {isError, isLoading, data: products} = useFetchProductPerUser(sellerId);

  return (
    <div className="w-full py-2  bg-[#E5EBFC] mb-[80px]">
        <div className="w-full bg-white px-4 [@media(min-width:375px)]:px-6 py-4">
            <div className="w-full flex items-center justify-between">
                <Link href={`/profile/${sellerId}`} className="size-[60px] rounded-full overflow-hidden  shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] flex items-center justify-center">
                    <Image className='object-cover object-center' blurDataURL="/assets/images/default-profile-avatar.webp" alt="Profile picture" width={60} height={60} src={seller?.profile.imageUrl ? seller.profile.imageUrl : defaultProfileAvatar} />
                </Link >
                <div className="flex flex-col items-center">
                    <h3 className='text-[15px] font-raleway font-normal text-[#202020]'>Posted by <Link href={`/profile/${sellerId}`} className='text-dark-blue font-bold'>{seller?.profile.name.length && seller?.profile.name.length > 11 ? seller?.profile.name.substring(0,11) +'...' : seller?.profile.name }</Link></h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Calendar className='size-[12px] text-black' />
                        <p className='font-nunito-sans text-black font-normal text-[10px]'>Member since {seller?.createdAt.substring(0,10)}</p>
                    </div>
                </div>
                <ArrowRightButton url={`/profile/${sellerId}`}/>
            </div>

            <div className="w-full flex items-center justify-center mt-2">
                <div className="px-4 border-x-1 border-[#E5EBFC] flex flex-col items-center justify-center">
                    <h5 className='text-[15px] font-raleway font-bold text-dark-blue'>{products?.length}</h5>
                    <p className='font-nunito-sans text-black font-normal text-[10px]'>Item(s) Listed</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SellerInfo