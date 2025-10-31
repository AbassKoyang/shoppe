'use client';
import { useAuth } from '@/lib/contexts/auth-context';
import { updateNotification } from '@/services/users/api'
import { NotificationType } from '@/services/users/types'
import { QueryClient, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner';

const NotificationCard = ({notification}:{notification: NotificationType}) => {
    const {user} = useAuth();
    const queryClient = new QueryClient();

    const updateNotificationMutation = useMutation({
        mutationKey: ['addProductToWishList'],
        mutationFn: (notificationId: string) => updateNotification(notificationId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['notifications']});
        }
      });

      const handleUpdateNotification = async (notificationId: string) => {
  
        try {
          if (!user) {
            toast.error("You must be logged in to view notifications.");
            return;
          }
      
      
          await updateNotificationMutation.mutateAsync(notificationId);
        } catch (error: any) {
          console.error("❌ Error updating notis:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to view notification.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while updating notification. Please try again.");
          }
        }
      };


    return (
    <Link onClick={() => handleUpdateNotification(notification.id || '')} href={notification.link} className={`w-full flex justify-between items-start py-2 px-2 rounded-xl border-1 border-gray-200 mb-1 ${notification.isRead ? 'bg-white' : 'bg-[#E5EBFC]'}`}>
        <div className="w-full">
            <h5 className='text-[16px] font-raleway font-semibold text-[#202020]'>{notification.title}</h5>
            <p className='font-nunito-sans text-[12px] font-light text-gray-600'>{notification.body}</p>
        </div>
    </Link>
  )
}

export default NotificationCard