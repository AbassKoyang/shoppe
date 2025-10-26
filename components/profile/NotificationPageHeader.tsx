import { useAuth } from '@/lib/contexts/auth-context'
import { defaultProfileAvatar } from '@/public/assets/images/exports'
import { Bell, Heart, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NotificationPageHeader = () => {
    const {user} = useAuth();
  return (
    <div className='w-full flex items-center justify-between py-4'>
        <div className='flex items-center gap-2'>
            <Link href='/settings/profile' className='relative size-[50px] rounded-full overflow-hidden object-contain object-center border-[2px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]'>
                <Image src={user?.profile.imageUrl ? user.profile.imageUrl : defaultProfileAvatar} width={46} height={46}  className='' alt='Profile avatar' />
            </Link>
            <h5 className='text-[16px] font-bold font-raleway text-black px-4 py-1.5'>Notifications</h5>
        </div>
        <div className=" flex items-center gap-2">
        <Link href='/settings' className='cursor-pointer size-[35px] flex items-center justify-center bg-[#E5EBFC] rounded-full'>
            <Settings   className='text-dark-blue size-[18px]' />
        </Link>
        </div>
    </div>
  )
}

export default NotificationPageHeader