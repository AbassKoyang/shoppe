import { db } from '@/lib/firebase';
import {doc, collection, setDoc, addDoc, getDocs, where, query, updateDoc, serverTimestamp, deleteDoc, getDoc} from 'firebase/firestore';
import { paymentMethodType, User } from './types';
import { id } from 'zod/v4/locales';

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

export const updateUserProfile = async ({uid, name, email, imageUrl, language} : {uid: string; name: string; email: string; imageUrl: string; language: 'English' | 'Français'}) => {
    try {
        await updateDoc(doc(db, 'users', uid), {
            profile: {
                name,
                email,
                imageUrl,
                language
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

export const updatePaymentMethod = async ({id, userId, cardHolder, brand, last4, expiryDate, cvv, token} : paymentMethodType) => {
    try {
        const docRef = doc(db, "payment-methods", (id || ''));
        await updateDoc(docRef, {
            userId, cardHolder, brand, last4, expiryDate, cvv, token, createdAt: serverTimestamp(),
        });
        console.log('Updated card succesfully.');
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

export const updateUserShippingAddress = async ({uid, country, address, city, postalCode, phoneNumber = ''} : {uid: string; country: string; address: string; city: string; postalCode: string; phoneNumber?: string;}) => {
    try {
        await updateDoc(doc(db, 'users', uid), {
            shippingAddress: {
                country,
                address,
                city,
                postalCode,
                phoneNumber
            }
        });
        console.log('User shipping address updated succesfully')
    } catch (error) {
        console.error(error);
    }
};

export const fetchLanguage = async (uid: string) => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Return language OR null, but never undefined
        console.log('Doc', docSnap.data().l);
        const {profile} = docSnap.data()
        return  profile.language;
      }

      return null;
  };
  
export const updateLanguage = async ({uid, language} : {uid: string; language: 'Français' | 'English';}) => {
    try {
        await updateDoc(doc(db, 'users', uid), {
            profile: {
                language
            }
        });
        console.log('Language updated succesfully')
    } catch (error) {
        console.error(error);
    }
};
