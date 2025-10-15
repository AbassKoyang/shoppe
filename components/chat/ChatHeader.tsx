import { defaultProfileAvatar } from '@/public/assets/images/exports';
import { ProductType } from '@/services/products/types';
import { AppUserType } from '@/services/users/types';
import { ArrowLeft, EllipsisVertical, Menu, Phone, Video } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import ChatProductCard from './ChatProductCard';


const ChatHeader = ({user, productDetails, userTyping, userOnline} : {user: AppUserType; productDetails: ProductType; userTyping: boolean; userOnline: boolean;}) => {
    const router = useRouter()
    console.log(user?.profile.imageUrl)
  return (
    <header className='w-full fixed top-0 left-0 z-1000'>
        <div className="w-full px-2 [@media(min-width:375px)]:px-4 py-3 bg-white flex items-center justify-between relative">
            <div className="flex gap-4"> 
                <button onClick={() => router.back()}>
                    <ArrowLeft className='size-[25px]' />
                </button>
            <div className="flex gap-2 items-center">
                <Link href='#' className='relative size-[44px] rounded-full overflow-hidden object-contain object-center border-[2px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]'>
                    <Image src={user?.profile.imageUrl ? user.profile.imageUrl : defaultProfileAvatar} width={40} height={40}  className='' alt='Profile avatar' />
                </Link>
                <h5 className='text-[20px] text-dark-blue font-bold font-raleway tracking-[-0.2px]'>{user.profile.name}</h5>
            </div>
            </div>
            <div className="flex gap-3 items-center">
                {userTyping && userOnline && (
                    <p className='text-dark-blue text-[12px] italic'>Typing...</p>
                )}
                {userOnline && !userTyping && (
                    <p className='text-dark-blue text-[12px] italic'>Online</p>
                )}
                <button>
                    <EllipsisVertical className='size-[20px]' />
                </button>
            </div>
            <ChatProductCard product={productDetails} />
        </div>
    </header>
)
}

export default ChatHeader