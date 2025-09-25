import { db } from '@/lib/firebase';
import {doc, collection, setDoc, addDoc, getDocs, where, query, updateDoc, serverTimestamp, deleteDoc, getDoc} from 'firebase/firestore';
import { ProductType } from './types';
export const addProduct = async (data : ProductType) => {
    try {
        const colRef = collection(db, "products");
        await addDoc(colRef, {
            ...data
        })
        console.log('Product added succesfully');
        return true;
    } catch (error) {
        console.error(error);
    }
};

export const fetchProductCategoryCount = async (label: string) => {
    const colRef = collection(db, "products");
    const blabla = () => {
        if (label) {
            return where('category', '==', label);
        }
    }
    try {
        const q = query(colRef, where('category', '==', label ), where('category', '==', label ));
        const querySnapshot = await getDocs(q);
        
        if(!querySnapshot.empty){
            const count = querySnapshot.docs.length;
            return count;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error category count:', error);
        throw error;
    }
};