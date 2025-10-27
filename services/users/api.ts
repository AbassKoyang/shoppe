import { db } from '@/lib/firebase';
import {doc, collection, setDoc, addDoc, getDocs, where, query, updateDoc, serverTimestamp, deleteDoc, getDoc, orderBy, limit, startAfter, DocumentSnapshot} from 'firebase/firestore';
import { fetchNotificationsParamsType, fetchNotificationsReturnType, NotificationType, User } from './types';

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
export const fetchUserById = async (userId: string) : Promise<User | null> => {
    const userRef = doc(db, 'users', userId);
    try {
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            return {
                id: userDoc.id,
                ...userDoc.data(),
            } as User;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fethcing user by userId:', error);
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
export const fetchCurrency = async (uid: string) => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Return language OR null, but never undefined
        console.log('Doc', docSnap.data().l);
        const {shopPrefrences} = docSnap.data()
        return  shopPrefrences.currency;
      }

      return null;
  };
export const fetchSize = async (uid: string) => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Return language OR null, but never undefined
        console.log('Doc', docSnap.data().l);
        const {shopPrefrences} = docSnap.data()
        return  shopPrefrences.size;
      }

      return null;
  };
export const fetchCountry = async (uid: string) => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Return language OR null, but never undefined
        console.log('Doc', docSnap.data().l);
        const {shopPrefrences} = docSnap.data()
        return  shopPrefrences.country;
      }

      return null;
  };
  
export const updateLanguage = async ({uid, language} : {uid: string; language: 'Français' | 'English';}) => {
    try {
        await updateDoc(doc(db, 'users', uid), {
            "profile.language": language
        });
        console.log('Language updated succesfully')
    } catch (error) {
        console.error(error);
    }
};
export const updateCurrency = async ({uid, currency} : {uid: string; currency: '$ USD' | '€ EURO' | '₦ NGN';}) => {
    try {
        await updateDoc(doc(db, 'users', uid), {
            "shopPrefrences.currency" : currency
        });
        console.log('Language currency succesfully')
    } catch (error) {
        console.error(error);
    }
};
export const updateSize = async ({uid, size} : {uid: string; size: 'US'| 'UK'| 'EU';}) => {
    try {
        await updateDoc(doc(db, 'users', uid), {
            "shopPrefrences.size": size
            });
        console.log('Language size succesfully')
    } catch (error) {
        console.error(error);
    }
};
export const updateCountry = async ({uid, country} : {uid: string; country: string;}) => {
    try {
        await updateDoc(doc(db, 'users', uid), {
            "shopPrefrences.country": country
            });
        console.log('Country updated succesfully')
    } catch (error) {
        console.error(error);
    }
};
export const deleteAccount = async (uid: string) => {
    console.log('Uid:', uid)
        const docRef = doc(db, "users", uid);
    try {
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting user account:', error);
        throw error;
    }
}

const PAGE_SIZE = 10;

export const fetchNotifications = async ({pageParam, userId}: fetchNotificationsParamsType) : Promise<fetchNotificationsReturnType> => {
    const colRef = collection(db, 'notifications');
    let q;
    if(!pageParam) {
        q = query(colRef, where("userId", "==", userId), orderBy("createdAt", 'desc'), limit(PAGE_SIZE))
    } else {
        q = query(colRef, where("userId", "==", userId), orderBy("createdAt", 'desc'), limit(PAGE_SIZE), startAfter(pageParam))
    }
    
    try {
        const snapshot = await getDocs(q);
        const lastDoc : DocumentSnapshot = snapshot.docs[snapshot.docs.length - 1];
        const notifications = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as NotificationType[];
        return {notifications, lastVisible: lastDoc}

    } catch (error) {
        console.error('Error fethcing notifications:', error);
        throw error;
    }
}

export const updateNotification = async (notificationId: string) => {
    try {
        await updateDoc(doc(db, 'notifications', notificationId), {
            "isRead": true
            });
        console.log('Country updated succesfully')
    } catch (error) {
        console.error(error);
    }
};

