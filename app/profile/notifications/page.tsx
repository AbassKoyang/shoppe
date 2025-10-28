'use client';
import NotificationCard from '@/components/profile/NotificationCard';
import NotificationCardSkeleton from '@/components/profile/NotificationCardSkeleton';
import NotificationPageHeader from '@/components/profile/NotificationPageHeader'
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/contexts/auth-context';
import { db } from '@/lib/firebase';
import { useFetchNotifications } from '@/services/users/queries';
import axios from 'axios';
import { doc, updateDoc } from 'firebase/firestore';
import { LoaderCircle } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';


const page = () => {
    const {user} = useAuth();
    const { ref, inView } = useInView();

    const {
    data,
    fetchNextPage,
    hasNextPage,
    error,
    isFetchingNextPage,
    isLoading,
    isError,
    } = useFetchNotifications(user?.uid || '');

    useEffect(() => {
        if (inView && hasNextPage) {
          fetchNextPage();
        }
      }, [inView, hasNextPage, fetchNextPage]);

    console.log(data);  

    const allNotifications = useMemo(() => {
        return data?.pages.flatMap(page => page.notifications) ;
      }, [data]);

    const updateLastSeen = async (userId: string) => {
       try {
        await updateDoc(doc(db, "users", userId), {
            lastSeenNotificationsAt: Date.now()
        });
          
       } catch (error) {
        console.error(error)
       }
    }
    
    useEffect(() => {
        updateLastSeen(user?.uid || '')
    }, [user?.uid]);
    
  return (
    <section className='w-full'>
        <NotificationPageHeader />
        {isLoading && (
            <>
            {Array.from({length: 10}).map((_, i) => (
                <NotificationCardSkeleton key={i} />
            ))}
            </>
        )}
        {isError && (
            <div className='flex items-center justify-center w-full h-[100vh]'>
                 <p className='font-nunito-sans'>Oops, failed to fetch notifications.</p>
            </div>
        )}
        {allNotifications && allNotifications.map((notis) => (
            <NotificationCard key={notis.id} notification={notis} />
        ))}
            <div className='w-full flex items-center justify-center py-3' ref={ref}>
                {isFetchingNextPage ? <LoaderCircle className="animate-spin size-[26px] text-dark-blue" /> : null}
            </div>
    </section>
  )
}

export default page