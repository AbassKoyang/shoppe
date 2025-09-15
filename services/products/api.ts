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
}