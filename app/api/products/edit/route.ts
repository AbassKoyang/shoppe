import {NextResponse} from  'next/server';
import {algoliasearch} from 'algoliasearch'
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductType } from '@/services/products/types';
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const ALGOLIA_WRITE_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY!;
const ALGOLIA_SEARCH_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;
const ALGOLIA_INDEX_NAME = "products";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_API_KEY);

export const POST = async (req: Request) => {
  const body : ProductType = await req.json();
    try {
        const docRef = doc(db, "products", body.id || '');
        console.log({
            ...body,
            status: 'available',
            price: Number(body.price) || 0,
            discount: Number(body.discount) || 0,
            updatedAt: Date.now(),
        })
        const productDoc = await updateDoc(docRef, {
            ...body,
            status: 'available',
            price: Number(body.price) || 0,
            discount: Number(body.discount) || 0,
            updatedAt: Date.now(),
        })
        console.log('Product updated in firestore succesfully');
        await client.partialUpdateObject({
        indexName: ALGOLIA_INDEX_NAME,
          objectID: docRef.id,
          attributesToUpdate : {sellerID: body.sellerId,
          title: body.title,
          description: body.description,
          price: Number(body.price) || 0,
          discount: Number(body.discount) || 0,
          currency: body.currency,
          image: body.images[0] || null,
          category: body.category,
          subCategory: body.subCategory,
          condition: body.condition,
          size: body.size,
          gender:  body?.gender || null,
          brand: body?.brand || null,
          color: body?.color || null,
          material: body?.material || null,
          location:  body.location,
          views:  body.views,
          status: 'available',
          updatedAt: Date.now(),
        }});
        console.log("Product updated in Algolia succesfully");
        return NextResponse.json({ success: true, product: body });
      } catch (err) {
        console.error("❌ Error updating in Algolia:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
      }
};