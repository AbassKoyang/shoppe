import { NextResponse } from "next/server";
import {algoliasearch} from 'algoliasearch'
import {collection, deleteDoc, writeBatch, where, doc, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductType } from '@/services/products/types';
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const ALGOLIA_WRITE_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY!;
const ALGOLIA_SEARCH_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;
const ALGOLIA_INDEX_NAME = "products"; 

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_API_KEY);

export const DELETE = async (req: Request)  => {
    const body = await req.json();
    const productId : string = body.productId!;
    try {
        const docRef = doc(db, 'products', productId);
        await deleteDoc(docRef);
        console.log('Product deleted from firestore succesfully');
        await client.deleteObject({
            indexName: ALGOLIA_INDEX_NAME,
            objectID: productId
        })
        console.log('Product deleted from algolia succesfully');
        const q = query(collection(db, "recentlyViewed"), where("productId", "==", productId));
        const snapshot = await getDocs(q);
      
        const recentBatch = writeBatch(db);
      
        snapshot.docs.forEach((doc) => {
          recentBatch.delete(doc.ref);
        });
      
        await recentBatch.commit();
        console.log("Batch delete complete!");

        const wq = query(collection(db, "wishlists"), where("product.id", "==", productId));
        const wsnapshot = await getDocs(wq);
      
        const wBatch = writeBatch(db);
      
        wsnapshot.docs.forEach((doc) => {
            wBatch.delete(doc.ref);
        });
      
        await wBatch.commit();
        console.log("wBatch delete complete!");
        return NextResponse.json({ success: true, productId: productId });
    } catch (error) {
        console.error("Error deleting from Algolia:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}