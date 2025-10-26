import { db } from '@/lib/firebase';
import {doc, collection, setDoc, addDoc, getDocs, where, query, updateDoc, serverTimestamp, deleteDoc, getDoc, QueryConstraint, limit, orderBy, DocumentData} from 'firebase/firestore';
import { ProductType, recentlyViewedType } from './types';
import { formatFilterURL } from '@/lib/utils/formatFilterURL';
import { WishlistType } from '../products/types';
import { getEndOfDay, getStartOfDay } from '@/lib/utils';
import z from 'zod';
import { recentlyViewedProductSchema } from './schema';
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

export const editProduct = async (data : ProductType) => {
    try {
        const res = await fetch('/api/products/edit', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data),
        })
        if(!res.ok){
          throw new Error("Failed to edit product");
        }
        console.log('Product edited succesfully 2');
        return res.json();
    } catch (error) {
        console.error('Error from editProduct', error);
        throw new Error("Failed to edit product");
    }
};

export const addProductToWishlist = async (data : WishlistType, userId: string) => {
  const colRef = collection(db, 'wishlists');
    try {
      const q = query(colRef,  where('product.id', '==', data.product.id), where('userId', '==', userId));
        const querySnapshot = (await getDocs(q));
  
      if (!querySnapshot.empty) {
        throw Error('product-already-in-wishlist');
      }
      try {
        await addDoc(colRef, data);
        console.log('Product added to wishlist succesfully')
        return true;
    } catch (error) {
        console.error(error)
    }
    } catch (error) {
        console.error('Error adding item to wishlist', error);
        throw error;
    }
};
export const removeProductFromWishlist = async (userId: string, productId: string) => {
  const colRef = collection(db, 'wishlists');
    try {
      const q = query(colRef, where('product.id', '==', productId), where('userId', '==', userId));
      const querySnapshot = (await getDocs(q));
  
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
          const docRef = doc(db, "wishlists", docId);
        await deleteDoc(docRef);
        console.log("✅ Product removed from wishlist successfully");
        return true;
      }
    } catch (error) {
        console.error('Error removing item from wishlist', error);
        throw error;
    }
};
export const isProductInWishlist = async (productId: string, userId: string) => {
  const colRef = collection(db, 'wishlists');

  try {
    const q = query(colRef, where('product.id', '==', productId), where('userId', '==', userId));
    const querySnapshot = (await getDocs(q));
    if (!querySnapshot.empty) {
      return true
    }
    return false;
  } catch (error) {
    console.error('Error checking if product is alreayd in wishlist:', error)
  }
}
export const incrementProductViews = async (productId: string) => {
  const docRef = doc(db, 'products', productId);
    try {
        const productDoc = await getDoc(docRef);
        const product = {id: productDoc.id, ...productDoc.data()} as ProductType
        await updateDoc(docRef, {
        views: product.views ? product.views + 1 : 0,
      })
    } catch (error) {
        console.error('Error incremeting item views', error);
        throw error;
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

export const fetchProductsBySubCategory = async (
    subCategory: string, filters: Record<string, string>) => {
      const filterUrl = formatFilterURL(filters);
      console.log(filterUrl)

  try{
      const res = await fetch(`/api/products/fetch-products-by-subcategory/?subCategory=${subCategory}&${filterUrl}`);
      if(!res.ok){
        throw new Error("Failed to fethc product");
      }
      return res.json();

    } catch (err: any) {
      console.error("Error fetching subCategory:", err);
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
export const fetchProductPerUser = async (id: string) => {
    const colRef = collection(db, "products");

    try {
        const q = query(colRef, where('sellerId', '==', id ));
        const querySnapshot = (await getDocs(q));
        
        if(!querySnapshot.empty){
            return querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching  user listed items:', error);
        throw error;
    }
};
export const fetchUserWishlist = async (userId: string) : Promise<WishlistType[]> => {
    const colRef = collection(db, "wishlists");

    try {
        const q = query(colRef, where('userId', '==', userId ));
        const querySnapshot = (await getDocs(q));
        
        if(!querySnapshot.empty){
            return querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as WishlistType[]
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching  user wish list:', error);
        throw error;
    }
};

export const fetchSingleProduct = async (id: string) : Promise<ProductType | null>  => {

  try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ProductType;
      } else {
        return null;
      }
  } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
  }
};

export const addProductToRecentlyViewed = async (userId: string, product: ProductType) => {
  if (!product.id) {
    throw new Error('Product ID is required');
  }
  
  const colRef = collection(db, "recentlyViewed");
  const recViewed : z.infer<typeof recentlyViewedProductSchema> = {
    userId: userId,
    productId: product.id,
    product: product,
    viewedAt: Date.now(),
  }

  const q = query(
    colRef,
    where("userId", "==", userId),
    where("productId", "==", product.id)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    await addDoc(colRef, recViewed);
  } else {
    const docRef = snap.docs[0].ref;
    await updateDoc(docRef, { viewedAt: Date.now() });
  }
};

export const getViewedToday = async (userId: string) : Promise<recentlyViewedType[]> => {
  const now = new Date();
  const start = getStartOfDay(new Date(now));
  const end = getEndOfDay(new Date(now));
  try {
    const q = query(
      collection(db, "recentlyViewed"),
      where("userId", "==", userId),
      where("viewedAt", ">=", start),
      where("viewedAt", "<=", end)
    );
  
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({id: doc.id, ...doc.data()})) as recentlyViewedType[];
  } catch (error) {
    console.error('erorrrrrr', error);
    return [];
  }
};

export const getViewedYesterday = async (userId: string) : Promise<recentlyViewedType[]> => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const start = getStartOfDay(new Date(yesterday));
  const end = getEndOfDay(new Date(yesterday));

  try {
    const q = query(
      collection(db, "recentlyViewed"),
      where("userId", "==", userId),
      where("viewedAt", ">=", start),
      where("viewedAt", "<=", end)
    );  
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data()) as recentlyViewedType[];
    } catch (error) {
      console.error('erorrrrrr', error);
      return [];
  }
  
};
export const getViewedOnSpecificDate = async (userId: string, selectedDate: Date) : Promise<recentlyViewedType[]> => {

  const start = getStartOfDay(new Date(selectedDate));
  const end = getEndOfDay(new Date(selectedDate));

  try {
    const q = query(
      collection(db, "recentlyViewed"),
      where("userId", "==", userId),
      where("viewedAt", ">=", start),
      where("viewedAt", "<=", end)
    );  
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data()) as recentlyViewedType[];
    } catch (error) {
      console.error('erorrrrrr', error);
      return [];
  }
  
};