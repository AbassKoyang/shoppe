// services/notification.service.ts
import admin from 'firebase-admin';
import { db } from '../firebase-admin';

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
        console.log(`No FCM token found for user ${userId}`);
        return null;
      }

      // Send notification
      const message = {
        token: user.fcmToken,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
      };

      const response = await admin.messaging().send(message);
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
  async notifyProductPurchase(sellerId: string, buyerName: string, productTitle: string, transactionId: string) {
    return this.sendToUser(sellerId, {
      title: '🎉 New Purchase!',
      body: `${buyerName} just bought "${productTitle}"`,
      data: {
        type: 'purchase',
        transactionId,
        action: 'view_transaction',
      },
    });
  }

  async notifyReceiptConfirmed(sellerId: string, productTitle: string, amount: number, transactionId: string) {
    return this.sendToUser(sellerId, {
      title: '💰 Payment Released!',
      body: `You received ₦${amount.toLocaleString()} for "${productTitle}"`,
      data: {
        type: 'payment_released',
        transactionId,
        action: 'view_transaction',
      },
    });
  }

  async notifyPaymentPending(buyerId: string, productTitle: string, transactionId: string) {
    return this.sendToUser(buyerId, {
      title: '⏳ Payment Pending',
      body: `Your payment for "${productTitle}" is being processed`,
      data: {
        type: 'payment_pending',
        transactionId,
        action: 'view_transaction',
      },
    });
  }

  async notifyDeliveryReminder(buyerId: string, productTitle: string, transactionId: string) {
    return this.sendToUser(buyerId, {
      title: '📦 Confirm Receipt',
      body: `Have you received "${productTitle}"? Confirm to release payment to seller`,
      data: {
        type: 'delivery_reminder',
        transactionId,
        action: 'confirm_receipt',
      },
    });
  }
}

export const notificationService = new NotificationService();