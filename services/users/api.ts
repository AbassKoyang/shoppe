import { db } from '@/lib/firebase';
import {doc, collection, setDoc, addDoc, getDocs, where, query, updateDoc, serverTimestamp} from 'firebase/firestore';
import { paymentMethodType, User } from './types';

export const saveUserToDB = async (data: User, uid: string) => {
    try {
        await setDoc(doc(db, 'users', uid), data);
        console.log('user saved succesfully')
    } catch (error) {
        console.error(error)
    }
}
export const fetchUserByEmail = async (email: string) : Promise<User | null> => {
    const userRef = collection(db, 'users');
    try {
        const q = query(userRef, where('profile.email', '==', email ));
        const querySnapshot = await getDocs(q);
        
        if(!querySnapshot.empty){
            const userDoc = querySnapshot.docs[0];
            return {
                ...userDoc.data(),
            } as User;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fethcing user by email:', error);
        throw error;
    }
}

export const updateUserProfile = async ({uid, name, email, imageUrl} : {uid: string; name: string; email: string; imageUrl: string;}) => {
    try {
        await updateDoc(doc(db, 'users', uid), {
            profile: {
                name,
                email,
                imageUrl
            }
        });
        console.log('user profile updated succesfully')
    } catch (error) {
        console.error(error);
    }
};
export const addPaymentMethod = async ({userId, cardHolder, brand, last4, expiryDate, cvv, token} : paymentMethodType) => {
    try {
        const colRef = collection(db, "payment-methods");
        await addDoc(colRef, {
            userId, cardHolder, brand, last4, expiryDate, cvv, token, createdAt: serverTimestamp(),
        });
        console.log('Added card succesfully.');
        return true;
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