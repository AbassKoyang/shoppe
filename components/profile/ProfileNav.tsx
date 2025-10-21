'use client';
import { useAuth } from '@/lib/contexts/auth-context';
import { useInboxContext } from '@/lib/contexts/inbox-context';
import { ArchiveRestore, EllipsisVertical, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

const ProfileNav = () => {
    const {user} = useAuth();
const pathname = usePathname();

return (
    <div className="w-full py-4 relative">
       <div className="w-full flex items-center justify-between">
        <Link href={`/profile/${user?.uid}`} className={`${pathname == `/profile/${user?.uid}` ? 'text-white' : 'text-[#202020]'} relative w-[30%] bg-[#F8F8F8] font-raleway text-[16px] font-semibold py-1.5 rounded-[40px] flex items-center justify-center overflow-hidden`}>
            <div className={`bg-dark-blue absolute top-0 left-0 z-10 transition-all duration-300 ease-in-out h-full ${pathname == `/profile/${user?.uid}` ? 'w-full' : 'w-0'}`}></div>
            <p className='z-20'>Listed Items</p>
        </Link>
        <Link href={`/profile/${user?.uid}/orders`} className={`${pathname == `/profile/${user?.uid}/orders` || pathname == `/profile/${user?.uid}/orders/delivered` ? 'text-white' : 'text-[#202020]'} relative w-[30%] bg-[#F8F8F8] font-raleway text-[16px] font-semibold py-1.5 rounded-[40px] flex items-center justify-center overflow-hidden`}>
            <div className={`bg-dark-blue absolute top-0 left-0 z-10 transition-all duration-300 ease-in-out h-full ${pathname == `/profile/${user?.uid}/orders` || pathname == `/profile/${user?.uid}/orders/delivered` ? 'w-full' : 'w-0'}`}></div>
            <p className='z-20'>Orders</p>
        </Link>
        <Link href={`/profile/${user?.uid}/sales`} className={`${pathname == `/profile/${user?.uid}/sales` ? 'text-white' : 'text-[#202020]'} relative w-[30%] bg-[#F8F8F8] font-raleway text-[16px] font-semibold py-1.5 rounded-[40px] flex items-center justify-center overflow-hidden`}>
            <div className={`bg-dark-blue absolute top-0 left-0 z-10 transition-all duration-300 ease-in-out h-full ${pathname == `/profile/${user?.uid}/sales`  ? 'w-full' : 'w-0'}`}></div>
            <p className='z-20'>Sales</p>
        </Link>
       </div>
    </div>
  )
}

export default ProfileNav