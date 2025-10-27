import admin from 'firebase-admin';
import { db } from '../firebase-admin';
import { io } from '..';
import { emailQueue } from "../lib/queues/emailQueue";
import { ReactNode } from 'react';

interface NotificationPayload {
  title: string;
  body: string;
  data?: { [key: string]: string };
}

class NotificationService {
  async sendToUser(userId: string, payload: NotificationPayload) {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      const user = userDoc.data();

      if (!user?.fcmToken) {
        console.log(`No FCM tokens found for user ${userId}`);
        return null;
      }

       const response =  await admin.messaging().send({
            token: user.fcmToken,
            notification: {
              title: payload.title,
              body: payload.body.length > 50 ? payload.body.slice(0,50) + "..." : payload.body,
              imageUrl: 'https://useshoppe.vercel.app/icon-512.png',
            },
            data: payload.data || {},
        })

        console.log('Notification sent successfully:', response);
        return response;

    } catch (error: any) {
      console.error('Error sending notification:', error);
      
      if (error.code === 'messaging/registration-token-not-registered') {
        await db.collection('users').doc(userId).update({
          fcmToken: admin.firestore.FieldValue.delete(),
        });
      }
      
      return null;
    }
  }

  async createNotification(receiverId: string, type: string, title: string, body: string, orderId: string){
    await db.collection('notifications').doc(receiverId).collection('items').add({
      type,
      title,
      body,
      link: `/orders/${orderId}`,
      isRead: false,
      createdAt: new Date(),
      userId: receiverId,
    })
  }

  async sendToMultipleUsers(userIds: string[], payload: NotificationPayload) {
    const promises = userIds.map(userId => this.sendToUser(userId, payload));
    return Promise.all(promises);
  }

  async notifyProductPurchase(sellerId: string, buyerName: string, productTitle: string, orderId: string) {
    this.createNotification(sellerId, 'new-purchase',  '🎉 New Purchase!',  `${buyerName} just bought "${productTitle}"`, orderId)
    io.to(sellerId).emit("newPurchaseNotification", {sellerId, body:  `${buyerName} just bought "${productTitle}"`, title: '🎉 New Purchase!', orderId})
    console.log('Notification sent to:', sellerId);

    return this.sendToUser(sellerId, {
      title: '🎉 New Purchase!',
      body: `${buyerName} just bought "${productTitle}"`,
      data: {
        type: 'new_purchase',
        orderId,
        action: 'view_order',
        url: `/orders/${orderId}`
      },
    });
  }

  async notifyReceiptConfirmed(sellerId: string, productTitle: string, amount: number, orderId: string) {
    this.createNotification(sellerId, 'payment-released',  '🎉 Payment Released!', `You received ₦${amount.toLocaleString()} for "${productTitle}"`, orderId)

    io.to(sellerId).emit("paymentReleasedNotification", {sellerId, body:  `You received ₦${amount.toLocaleString()} for "${productTitle}"`, title: '🎉 Payment Released!', orderId})
    console.log('Notification sent to:', sellerId);

    return this.sendToUser(sellerId, {
      title: '🎉 Payment Released!',
      body: `You received ₦${amount.toLocaleString()} for "${productTitle}"`,
      data: {
        type: 'payment_released',
        orderId,
        action: 'view_order',
        url: `/orders/${orderId}`
      },
    });
  }

  async notifyOrderPending(buyerId: string, productTitle: string, orderId: string) {
    this.createNotification(buyerId, 'order-pending',   '⏳ Order Pending',  `Your payment for "${productTitle}" has been received, payment will be released to seller when the item is delivered`, orderId);

    io.to(buyerId).emit("orderPendingNotification", {buyerId, body:  `Your payment for "${productTitle}" has been received, payment will be released to seller when the item is delivered`, title: '⏳ Order Pending', orderId})
    console.log('Notification sent to:', buyerId);
    
    return this.sendToUser(buyerId, {
      title: '⏳ Order Pending',
      body: `Your payment for "${productTitle}" has been received, payment will be released to seller when the item is delivered`,
      data: {
        type: 'order_pending',
        orderId,
        action: 'view_order',
        url: `/orders/${orderId}`
      },
    });
  }

  async notifyMarkAsDelivered(buyerId: string, productTitle: string, orderId: string) {
    this.createNotification(buyerId, 'order-delivered', '📦 Confirm Receipt', `Your order for "${productTitle}" has been delivered and is on its way to you. Have you received "${productTitle}"? Confirm to release payment to seller`, orderId);

    io.to(buyerId).emit("orderDeliveredNotification", {buyerId, body:  `Your order for "${productTitle}" has been delivered and is on its way to you. Have you received "${productTitle}"? Confirm to release payment to seller`, title: '📦 Confirm Receipt', orderId})
    console.log('Notification sent to:', buyerId);

    return this.sendToUser(buyerId, {
      title: '📦 Confirm Receipt',
      body: `Your order for "${productTitle}" has been delivered and is on its way to you. Have you received "${productTitle}"? Confirm to release payment to seller`,
      data: {
        type: 'order_delivered',
        orderId,
        action: 'confirm_receipt',
        url: `/orders/${orderId}`
      },
    });
  }

async queueEmail({to, subject, message, name, link} : {to: string; subject: string; message: string; name: string; link: string}) {
  await emailQueue.add("sendEmail", { to, subject, message, name, link }, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
  console.log("Email job added for:", to);
}

}

export const notificationService = new NotificationService();