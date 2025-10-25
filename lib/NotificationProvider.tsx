'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import socket from '@/lib/socket';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function NotificationProvider({children}:{children: ReactNode}) {
  const { user } = useAuth(); 
  const router = useRouter();

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
        toast("New Message", {
          description: message.length > 50 ? message.slice(0,50) + "..." : message,
          action: {
            label: "View Message",
            onClick: () => router.push(`https://useshoppe.vercel.app/chat/${chatId}`),
          },
        })
      };
    const handlePaymentReleasedNotification = ({
        sellerId,
        body,
        title,
        orderId,
      }: {
        sellerId: string;
        body: string;
        title: string;
        orderId: string;
      }) => {
        console.log('New notification received:', { sellerId, body, title, orderId });
        toast(title, {
          description: body.length > 50 ? body.slice(0,50) + "..." : body,
          action: {
            label: "View Order",
            onClick: () => router.push(`https://useshoppe.vercel.app/orders/${orderId}`),
          },
        })
      };


    const handleNewPurchaseNotification = ({
        sellerId,
        body,
        title,
        orderId,
      }: {
        sellerId: string;
        body: string;
        title: string;
        orderId: string;
      }) => {
        console.log('New notification received:', { sellerId, body, title, orderId });
        toast(title, {
          description: body.length > 50 ? body.slice(0,50) + "..." : body,
          action: {
            label: "View Order",
            onClick: () => router.push(`https://useshoppe.vercel.app/orders/${orderId}`),
          },
        })
      };


    const handleOrderPendingNotification = ({
        buyerId,
        body,
        title,
        orderId,
      }: {
        buyerId: string;
        body: string;
        title: string;
        orderId: string;
      }) => {
        console.log('New notification received:', { buyerId, body, title, orderId });
        toast(title, {
          description: body.length > 50 ? body.slice(0,50) + "..." : body,
          action: {
            label: "View Order",
            onClick: () => router.push(`https://useshoppe.vercel.app/orders/${orderId}`),
          },
        })
      };
      
    const handleOrderDeliveredNotification = ({
        buyerId,
        body,
        title,
        orderId,
      }: {
        buyerId: string;
        body: string;
        title: string;
        orderId: string;
      }) => {
        console.log('New notification received:', { buyerId, body, title, orderId });
        toast(title, {
          description: body.length > 50 ? body.slice(0,50) + "..." : body,
          action: {
            label: "View Order",
            onClick: () => router.push(`https://useshoppe.vercel.app/orders/${orderId}`),
          },
        })
      };
  
      socket.on('newMessageNotification', handleNewMessageNotification);
      socket.on('paymentReleasedNotification', handlePaymentReleasedNotification);
      socket.on('newPurchaseNotification', handleNewPurchaseNotification);
      socket.on('orderPendingNotification', handleOrderPendingNotification);
      socket.on('orderDeliveredNotification', handleOrderDeliveredNotification);
  
      return () => {
        socket.off('newMessageNotification', handleNewMessageNotification);
        socket.off('paymentReleasedNotification', handlePaymentReleasedNotification);
        socket.off('newPurchaseNotification', handleNewPurchaseNotification);
        socket.off('orderPendingNotification', handleOrderPendingNotification);
        socket.off('orderDeliveredNotification', handleOrderDeliveredNotification);
      };
    }, [user?.uid]);


  return(
    <>{children}</>
  );
}