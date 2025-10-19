export type paymentMethodType =  {id?: string; userId: string; cardHolder: string; brand: string; last4: string; expiryMonth: string; expiryYear: string, email: string; authorisationCode: string; createdAt?: string;}
export type bankDetailsType = {
    recipientCode: string;
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    currency: string;
}