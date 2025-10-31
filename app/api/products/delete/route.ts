import { NextResponse } from "next/server";
import {algoliasearch} from 'algoliasearch'
import {deleteDoc, doc } from 'firebase/firestore';
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
        return NextResponse.json({ success: true, productId: productId });
    } catch (error) {
        console.error("Error deleting from Algolia:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}