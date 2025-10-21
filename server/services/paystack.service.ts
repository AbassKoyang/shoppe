import axios from 'axios';
import { db } from '../firebase-admin';
import { User } from '../types';

process.env.PAYSTACK_SECRET_KEY;
const PLATFORM_FEE_PERCENTAGE = 15; // 15% platform fee

class PaystackService {
  private baseURL = 'https://api.paystack.co';
  private getHeaders() {
    return {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };
  }
  private productsCollection = db.collection('users');

  // Charge authorization (direct charge using saved card)
  async chargeAuthorization(data: {
    email: string;
    amount: number; // in kobo
    authorization_code: string;
    metadata: any;
  }) {
    try {
      const response = await axios.post(
        `${this.baseURL}/transaction/charge_authorization`,
        data,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack charge error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Payment failed');
    }
  }

  // Verify transaction
  async verifyTransaction(reference: string) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${reference}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack verification error:', error.response?.data);
      throw new Error('Payment verification failed');
    }
  }

  // Create transfer recipient (for seller)
  async getRecipientSellerCode(userId: string) {
    try {
        const doc = await this.productsCollection.doc(userId).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as User;
    } catch (error: any) {
      console.error('Get recipient code error:', error.response?.data);
      throw new Error('Failed to get seller recipient code');
    }
  }

  // Transfer funds to seller
  async transferFunds(data: {
    amount: number; // in kobo
    recipient: string; // recipient code
    reason: string;
    reference: string;
  }) {
    try {
      const response = await axios.post(
        `${this.baseURL}/transfer`,
        data,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Transfer error:', error.response?.data);
      throw new Error('Transfer failed');
    }
  }

  // Calculate platform fee and seller amount
  calculateAmounts(totalAmount: number) {
    const platformFee = Math.round(totalAmount * (PLATFORM_FEE_PERCENTAGE / 100));
    const sellerAmount = totalAmount - platformFee;
    
    return { platformFee, sellerAmount };
  }
}

export const paystackService = new PaystackService();