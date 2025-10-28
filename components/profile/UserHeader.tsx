import { useAuth } from '@/lib/contexts/auth-context'
import { db } from '@/lib/firebase'
import { defaultProfileAvatar } from '@/public/assets/images/exports'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { Bell, Heart, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const UserHeader = () => {
    const {user} = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const firstName = user?.profile.name && user?.profile.name.split(' ')[0].length > 8 ? user?.profile.name.split(' ')[0].substring(0,8) : user?.profile.name.split(' ')[0];

    const listenToUnreadCount = (userId: string, setCount: (count: number) => void) => {
    const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("createdAt", ">", user?.lastSeenNotificationsAt)
    );

    return onSnapshot(q, (snapshot) => {
        setCount(snapshot.size);
    });
    }

useEffect(() => {
  const unsubscribe = listenToUnreadCount(user?.uid || '', setUnreadCount);
  return () => unsubscribe();
}, [user?.uid]);


  return (
    <div className='w-full flex items-center justify-between py-4'>
        <div className='flex items-center gap-2'>
            <Link href='/settings/profile' className='relative size-[50px] rounded-full overflow-hidden object-contain object-center border-[2px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]'>
                <Image src={user?.profile.imageUrl ? user.profile.imageUrl : defaultProfileAvatar} width={46} height={46}  className='' alt='Profile avatar' />
            </Link>
            <h5 className='text-[16px] font-medium font-nunito-sans text-black px-4 py-1.5 rounded-4xl bg-[#E5EBFC]'>Hi, {firstName}</h5>
        </div>
        <div className=" flex items-center gap-2">
        <Link  href='/profile/notifications' className='cursor-pointer size-[35px] flex items-center justify-center bg-[#E5EBFC] rounded-full relative'>
            <Bell  className='text-dark-blue size-[18px]' />
            <p className="p-1 py-0.5 rounded-full bg-[#de5959] text-[12px] font-nunito-sans absolute top-[-30%] right-[-10%] text-white">{unreadCount}</p>
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