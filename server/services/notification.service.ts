// services/notification.service.ts
import admin from 'firebase-admin';
import { db } from '../firebase-admin';
import { io } from '..';

interface NotificationPayload {
  title: string;
  body: string;
  data?: { [key: string]: string };
}

class NotificationService {
  // Send notification to a specific user
  async sendToUser(userId: string, payload: NotificationPayload) {
    try {
      // Get user's FCM token
      const userDoc = await db.collection('users').doc(userId).get();
      const user = userDoc.data();

      if (!user?.fcmToken) {
        console.log(`No FCM tokens found for user ${userId}`);
        return null;
      }

      // Send notification

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
      
      // Remove invalid token
      if (error.code === 'messaging/registration-token-not-registered') {
        await db.collection('users').doc(userId).update({
          fcmToken: admin.firestore.FieldValue.delete(),
        });
      }
      
      return null;
    }
  }

  // Send notification to multiple users
  async sendToMultipleUsers(userIds: string[], payload: NotificationPayload) {
    const promises = userIds.map(userId => this.sendToUser(userId, payload));
    return Promise.all(promises);
  }

  // Notification templates for escrow events
  async notifyProductPurchase(sellerId: string, buyerName: string, productTitle: string, orderId: string) {
    return this.sendToUser(sellerId, {
      title: '🎉 New Purchase!',
      body: `${buyerName} just bought "${productTitle}"`,
      data: {
        type: 'purchase',
        orderId,
        action: 'view_order',
        url: `/orders/${orderId}`
      },
    });
  }

  async notifyReceiptConfirmed(sellerId: string, productTitle: string, amount: number, orderId: string) {
    io.to(sellerId).emit("paymentReleasedNotification", {sellerId, body:  `You received ₦${amount.toLocaleString()} for "${productTitle}"`, title: 'Payment Released!', orderId})
    console.log('Notification sent to:', sellerId);

    return this.sendToUser(sellerId, {
      title: '💰 Payment Released!',
      body: `You received ₦${amount.toLocaleString()} for "${productTitle}"`,
      data: {
        type: 'payment_released',
        orderId,
        action: 'view_order',
        url: `/orders/${orderId}`
      },
    });
  }

  async notifyPaymentPending(buyerId: string, productTitle: string, orderId: string) {
    return this.sendToUser(buyerId, {
      title: '⏳ Payment Pending',
      body: `Your payment for "${productTitle}" is being processed`,
      data: {
        type: 'payment_pending',
        orderId,
        action: 'view_order',
        url: `/orders/${orderId}`
      },
    });
  }

  async notifyMarkAsDelivered(buyerId: string, productTitle: string, orderId: string) {
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
}

export const notificationService = new NotificationService();