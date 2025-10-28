import {NextResponse} from  'next/server';
import {algoliasearch} from 'algoliasearch'
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductType } from '@/services/products/types';
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const ALGOLIA_WRITE_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY!;
const ALGOLIA_SEARCH_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;
const ALGOLIA_INDEX_NAME = "products"; // your Algolia index name

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_API_KEY);

export const POST = async (req: Request) => {
  const body : ProductType = await req.json();
  const location = body.location!
  const locationFacets = location?.split(',');
    try {
        const colRef = collection(db, "products");
        const docRef = await addDoc(colRef, {
            ...body,
            status: 'available',
            price: Number(body.price) || 0,
            discount: Number(body.discount) || 0,
            createdAt: Date.now(),
            location_facets: [...locationFacets]
        })
        console.log('Product added to firestore succesfully');
        await client.saveObject({indexName: ALGOLIA_INDEX_NAME, body:{
          objectID: docRef.id,
          sellerID: body.sellerId,
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
          location_facets: [...locationFacets],
          views:  body.views,
          status: 'available',
          createdAt: Date.now(),
        }});
        console.log("Product added to Algolia succesfully");
        return NextResponse.json({ success: true, product: body });
      } catch (err) {
        console.error("❌ Error adding to Algolia:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
      }
};