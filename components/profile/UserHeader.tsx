import { defaultProfileAvatar } from '@/public/assets/images/exports'
import { Bell, GalleryVerticalEnd, Settings } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const UserHeader = () => {
    const userImage = ''
  return (
    <div className='w-full flex items-center justify-between'>
        <div className='flex items-center gap-2'>
            <div className='relative size-[44px] rounded-full overflow-hidden object-contain object-center border-[4px] border-white shadow-[0px_-5px_20px_0px_rgba(0,0,0,0.12)]'>
                <Image src={userImage ? userImage : defaultProfileAvatar} width={40} height={40}  className='' alt='Profile avatar' />
            </div>
            <h4 className='text-[20px] font-bold font-nunito-sans text-black'>Hi, Koyang</h4>
        </div>
        <div className=" flex items-center gap-2">
        <button className='cursor-pointer size-[35px] flex items-center justify-center bg-[#E5EBFC] rounded-full'>
            <Bell strokeWidth={1} className='text-dark-blue size-[18px]' />
        </button>
        <button className='cursor-pointer size-[35px] flex items-center justify-center bg-[#E5EBFC] rounded-full'>
         <GalleryVerticalEnd   strokeWidth={1} className='text-dark-blue size-[18px]' />
        </button>
        <button className='cursor-pointer size-[35px] flex items-center justify-center bg-[#E5EBFC] rounded-full'>
            <Settings  strokeWidth={1} className='text-dark-blue size-[18px]' />
        </button>
        </div>
    </div>
  )
}

export default UserHeader