import { db } from "@/lib/firebase";
import { paymentMethodType } from "../payment/types";
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

export const addPaymentMethod = async ({userId, cardHolder, email } :  {cardHolder: string; email: string; userId: string;}) => {
    try {
        const response = await fetch('/api/payments/add-card', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              name: cardHolder,
              userId: userId,
            }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.error || 'Failed to initialize payment');
          }
          console.log('card added sucessfuly');
          return data;
    } catch (error) {
        console.error(error);
    }
};

export const updatePaymentMethod = async ({id, email, cardHolder} :{cardHolder: string; email: string; id: string;}) => {
    try {
        const response = await fetch('/api/payments/edit-card', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              name: cardHolder,
              id: id,
            }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.error || 'Failed to initialize payment');
          }
          console.log('card edited sucessfuly');
          return data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchPaymentMethods = async (userId: string) : Promise<paymentMethodType[] | null> => {
        const colRef = collection(db, "payment-methods");
    try {
        const q = query(colRef, where('userId', '==', userId ));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map((doc) => ({
            id: doc.id, // ✅ keep Firestore ID for deletes/updates
            ...doc.data(),
          })) as paymentMethodType[];
    } catch (error) {
        console.error('Error fethcing payment methods:', error);
        throw error;
    }
}

export const deletePaymentMethodById = async (paymentMethodId: string) => {
    console.log('PaymentId:', paymentMethodId)
        const docRef = doc(db, "payment-methods", paymentMethodId);
    try {
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting payment methods:', error);
        throw error;
    }
}

export const addBank = async ({name, bankCode, accountNumber, userId, bankName } :  {name: string; bankCode: string; accountNumber: string; userId: string, bankName: string;}) => {
    try {
        const response = await fetch('/api/payments/add-bank', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name, 
                account_number : accountNumber, 
                bank_code: bankCode,
                bankName,
                userId,
            }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.error || 'Failed to add bank');
          }
          console.log('Bank added sucessfuly');
          return data;
    } catch (error) {
        console.error(error);
    }
};