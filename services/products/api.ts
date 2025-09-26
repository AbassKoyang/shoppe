import { db } from '@/lib/firebase';
import {doc, collection, setDoc, addDoc, getDocs, where, query, updateDoc, serverTimestamp, deleteDoc, getDoc, QueryConstraint, limit, orderBy, DocumentData} from 'firebase/firestore';
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




export const fetchProductsByCategory = async (
    category: string,
    filters: Record<string, string>,
    pageSize = 24
  ) => {
    try {
      const colRef = collection(db, "products");
      const constraints = [];
  
      // Always filter by category (no duplicate)
      if (category) constraints.push(where("category", "==", category));
  
      // Equality filters (only add if provided)
      if (filters.gender) constraints.push(where("gender", "==", filters.gender));
      if (filters.condition) constraints.push(where("condition", "==", filters.condition));
  
      // Sizes: parse comma-separated string into array
      if (filters.size) {
        const sizes = filters.size
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (sizes.length === 1) {
          constraints.push(where("sizes", "array-contains", sizes[0]));
        } else if (sizes.length > 1) {
          // array-contains-any accepts up to 10 items
          constraints.push(where("sizes", "array-contains-any", sizes.slice(0, 10)));
        }
      }
  
      // Price ranges — convert safely to Number
      const minPrice = filters.minPrice ? Number(filters.minPrice) : undefined;
      const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined;
  
      if (minPrice !== undefined && !Number.isNaN(minPrice)) {
        constraints.push(where("price", ">=", minPrice));
      }
      if (maxPrice !== undefined && !Number.isNaN(maxPrice)) {
        constraints.push(where("price", "<=", maxPrice));
      }
  
      // Order clause(s)
      const orderClauses: QueryConstraint[] = [];
      switch (filters.order) {
        case "Newest":
          orderClauses.push(orderBy("createdAt", "desc"));
          break;
        case "Oldest":
          orderClauses.push(orderBy("createdAt", "asc"));
          break;
        case "PriceAsc":
          orderClauses.push(orderBy("price", "asc"));
          break;
        case "PriceDesc":
          orderClauses.push(orderBy("price", "desc"));
          break;
        default:
          orderClauses.push(orderBy("createdAt", "desc"));
      }
  
      // build and execute query
      console.log('constraints:', constraints)
      const q = query(colRef, where("category", "==", category), limit(pageSize));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) return [];

      console.log(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (err: any) {
      // If Firestore requires an index it returns a helpful URL — extract and log it
      const msg = String(err?.message || err);
      const urlMatch = msg.match(/https?:\/\/console\.firebase\.google\.com\/[^\s)]+/);
      if (urlMatch) {
        console.error("Firestore requires a composite index. Create it here:", urlMatch[0]);
        // optionally rethrow a friendly error containing the url
        throw new Error(`Firestore requires an index. Create it: ${urlMatch[0]}`);
      }
  
      console.error("Error fetching category:", err);
      throw err;
    }
  };


export const fetchProductCategoryCount = async (category: string) => {
    const colRef = collection(db, "products");

    try {
        const q = query(colRef, where('category', '==', category ));
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