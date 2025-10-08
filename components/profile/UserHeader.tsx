import { defaultProfileAvatar } from '@/public/assets/images/exports'
import { Bell, Heart, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const UserHeader = () => {
    const userImage = ''
  return (
    <div className='w-full flex items-center justify-between'>
        <div className='flex items-center gap-2'>
            <div className='relative size-[50px] rounded-full overflow-hidden object-contain object-center border-[4px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]'>
                <Image src={userImage ? userImage : defaultProfileAvatar} width={40} height={40}  className='' alt='Profile avatar' />
            </div>
            <h4 className='text-[20px] font-bold font-nunito-sans text-black'>Hi, Koyang</h4>
        </div>
        <div className=" flex items-center gap-2">
        <Link  href='/' className='cursor-pointer size-[35px] flex items-center justify-center bg-[#E5EBFC] rounded-full'>
            <Bell  className='text-dark-blue size-[18px]' />
        </Link>
        <Link href='/wishlist' className='cursor-pointer size-[35px] flex items-center justify-center bg-[#E5EBFC] rounded-full'>
         <Heart    className='text-dark-blue size-[18px]' />
        </Link>
        <Link href='/settings' className='cursor-pointer size-[35px] flex items-center justify-center bg-[#E5EBFC] rounded-full'>
            <Settings   className='text-dark-blue size-[18px]' />
        </Link>
        </div>
    </div>
  )
}

export default UserHeader