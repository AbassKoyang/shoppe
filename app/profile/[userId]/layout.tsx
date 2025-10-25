'use client'
import ArrowRightButton from '@/components/ArrowRightButton'
import { EnableNotificationsButton } from '@/components/EnableNotificationsButton'
import JustForYouProductCard from '@/components/JustForYouProductCard'
import ProfileNav from '@/components/profile/ProfileNav'
import ProfileProductCardSkeleton from '@/components/profile/ProfileProductCardSkeleton'
import UserHeader from '@/components/profile/UserHeader'
import TopProductAvatar from '@/components/TopProductAvatar'
import { useAuth } from '@/lib/contexts/auth-context'
import { useFetchProductPerUser } from '@/services/products/queries'
import React from 'react'

const layout = ({children} :{children: React.ReactNode}) => {
  const {user} = useAuth();
  const {isError, isLoading, data: products} = useFetchProductPerUser(user?.uid || '');
  const permission = Notification.permission;

  return (
    <section className="w-full mt-2 relative overflow-x-hidden mb-[300px]">
        <UserHeader />
        {permission !== 'granted' && (
            <div className="w-full mt-3">
            <div className="w-full p-4 rounded-[10px] bg-[#F9F9F9]">
              <div className="w-full">
                <h6 className='font-raleway font-bold text-[#202020] text-[14px]'>Important</h6>
                <p className='font-nunito-sans text-[10px] font-normal text-black'>To receive notifications on: Click the button below. Tap the menu (⋮) in your browser Select "Add to Home screen" or "Install app". Tap "Add" or "Install". Open the app from your home screen.</p>
                <EnableNotificationsButton userId={user?.uid || ''} />
              </div>
            </div>
          </div>
        )}
        <ProfileNav />
        {children}
       
    </section>
  )
}

export default layout