'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import socket from '@/lib/socket';
import { toast } from 'react-toastify';

export function NotificationProvider({children}:{children: ReactNode}) {
  const { user } = useAuth(); 

  useEffect(() => {
    if (!user?.uid) return;

    const handleConnect = () => {
      socket.emit('join', user.uid);
      console.log('User joined room:', user.uid);
    };

    if (socket.connected) {
      socket.emit('join', user.uid);
    }

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;

    
    const handleNewMessageNotification = ({
        receiverId,
        message,
        type,
        chatId,
      }: {
        receiverId: string;
        message: string;
        type: string;
        chatId: string;
      }) => {
        console.log('New notification received:', { receiverId, message, type, chatId });
        toast(<div>New Notfication: {message}</div>)
        new Notification('New Message:', {
          icon: '/icon-512.png',
          body: message,
          tag: "new-message",
        })
      };
  
      socket.on('newMessageNotification', handleNewMessageNotification);
  
      return () => {
        socket.off('newMessageNotification', handleNewMessageNotification);
      };
    }, [user?.uid]);


  return(
    <>{children}</>
  );
}