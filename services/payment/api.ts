import { db } from "@/lib/firebase";
import { OrderDataType, paymentMethodType, TransactionType } from "../payment/types";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { AppUserType } from "../users/types";
import { ProductType } from "../products/types";

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

export const getPendingOrders = async (userId: string) : Promise<OrderDataType[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where("buyerInfo.id", "==", userId), where("productDetails.status", "==", 'pending'), orderBy('createdAt', 'desc'));
    
    const ordersSnapshot = await getDocs(q);
    return ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as OrderDataType[];
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    throw error;
  }
};
export const getDeliveredOrders = async (userId: string) : Promise<OrderDataType[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where("buyerInfo.id", "==", userId), where("productDetails.status", "==", 'sold'), orderBy('createdAt', 'desc'));
    
    const ordersSnapshot = await getDocs(q);
    return ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as OrderDataType[];
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) : Promise<OrderDataType> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    
    const orderDoc = await getDoc(orderRef);
    return {
      id: orderDoc.id,
      ...orderDoc.data()
    } as OrderDataType;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};