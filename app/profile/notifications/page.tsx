'use client';
import NotificationPageHeader from '@/components/profile/NotificationPageHeader'
import { useAuth } from '@/lib/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';

type NotificationType = {
    type: string;
    titletype: string;
    body: string;
    link: string;
    isRead: boolean;
    createdAt: number;
    userId: string;
}
const page = () => {
    const {user} = useAuth();
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

    </section>
  )
}

export default page