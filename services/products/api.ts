import { db } from '@/lib/firebase';
import {doc, collection, setDoc, addDoc, getDocs, where, query, updateDoc, serverTimestamp, deleteDoc, getDoc, QueryConstraint, limit, orderBy, DocumentData} from 'firebase/firestore';
import { ProductType } from './types';
import { formatFilterURL } from '@/lib/utils/formatFilterURL';
export const addProduct = async (data : ProductType) => {
    try {
        const res = await fetch('/api/products/add', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data),
        })
        if(!res.ok){
          throw new Error("Failed to add product");
        }
        console.log('Product added succesfully 2');
        return res.json();
    } catch (error) {
        console.error('Error from addProduct', error);
    }
};


export const fetchProductsByCategory = async (
    category: string, filters: Record<string, string>) => {
      const filterUrl = formatFilterURL(filters);
      console.log(filterUrl)

  try{
      const res = await fetch(`/api/products/fetch-products/?category=${category}&${filterUrl}`);
      if(!res.ok){
        throw new Error("Failed to fethc product");
      }
      return res.json();

    } catch (err: any) {
      console.error("Error fetching category:", err);
      throw err;
    }
  };

export const searchProductsIndex = async (query: string, filters: Record<string, string>) => {
      const filterUrl = formatFilterURL(filters);
      console.log(filterUrl)

  try{
      const res = await fetch(`/api/products/search/?query=${query}&${filterUrl}`);
      if(!res.ok){
        throw new Error("Failed to search product index");
      }
      return res.json();

    } catch (err: any) {
      console.error("Error searching product index:", err);
      throw err;
    }
  };


export const fetchProductCategoryCount = async (category: string) => {
    const colRef = collection(db, "products");

    try {
        const q = query(colRef, where('category', '==', category ));
        const querySnapshot = (await getDocs(q));
        
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

export const fetchSingleProduct = async (id: string) : Promise<ProductType | null>  => {

  try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        console.log('data:', { id: docSnap.id, ...docSnap.data() })
        return { id: docSnap.id, ...docSnap.data() } as ProductType;
      } else {
        return null;
      }
  } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
  }
};