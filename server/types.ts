import z from "zod";
import { ProductSchema, UserSchema } from "./schema";

export type ProductStatus = 'available' | 'pending' | 'sold';
export type TransactionStatus = 'pending' | 'released' | 'cancelled';

export type ProductType = z.infer<typeof ProductSchema>;

export interface Transaction {
  id?: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  amount: number;
  platformFee: number;
  sellerAmount: number;
  status: TransactionStatus;
  paystackReference: string;
  paystackTransferId?: string;
  createdAt: string;
  releasedAt?: string;
}

export interface PaymentCard {
  id: string;
  userId: string;
  cardHolder: string;
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  email: string;
  authorisationCode: string;
  createdAt: string;
}

export type User = z.infer<typeof UserSchema>;
export type PaymentMethodType =  {id?: string; userId: string; cardHolder: string; brand: string; last4: string; expiryMonth: string; expiryYear: string, email: string; authorisationCode: string; createdAt?: string;}
export type BankDetailsType = {
    recipientCode: string;
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    currency: string;
}
