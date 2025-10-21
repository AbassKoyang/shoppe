import { ProductType } from "../products/types";
import { AppUserType, User } from "../users/types";

export type paymentMethodType =  {id?: string; userId: string; cardHolder: string; brand: string; last4: string; expiryMonth: string; expiryYear: string, email: string; authorisationCode: string; createdAt?: string;}
export type bankDetailsType = {
    recipientCode: string;
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    currency: string;
}
export type TransactionStatus = 'pending' | 'released' | 'cancelled';

export type TransactionType = {
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
    createdAt: any;
    releasedAt?: any;
  }
  export type OrderDataType = {
    id?: string;
    buyerInfo: User;
    sellerInfo: User;
    productDetails: ProductType;
    transactionDetails: TransactionType;
    createdAt: any;
}