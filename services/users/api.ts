import { db } from '@/lib/firebase';
import {doc, collection, setDoc, addDoc, getDocs, where, query, updateDoc} from 'firebase/firestore';
import { User } from './types';

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

export const updateUserProfile = async ({uid, name, email} : {uid: string; name: string; email: string;}) => {
    try {
        await updateDoc(doc(db, 'users', uid), {
            profile: {
                name,
                email,
            }
        });
        console.log('user profile updated succesfully')
    } catch (error) {
        console.error(error);
    }
};