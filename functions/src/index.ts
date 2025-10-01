import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {algoliasearch} from "algoliasearch";

admin.initializeApp();

// 🔑 Get Algolia credentials from Firebase config
const ALGOLIA_APP_ID = functions.config().algolia.app_id;
const ALGOLIA_API_KEY = functions.config().algolia.api_key;
const ALGOLIA_INDEX_NAME = "products"; // your Algolia index name

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

//
// 1️⃣ Create record in Algolia when Firestore doc is created
//
export const onProductCreated = onDocumentCreated("products/{id}", async (event) => {
    const snapshot  = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    const data = snapshot?.data();
    const objectID = snapshot?.id;; // Firestore doc id

    try {
      await client.saveObject({indexName: ALGOLIA_INDEX_NAME, body:{
        objectID,
        sellerID: data.sellerId,
        title: data.title,
        description: data.description,
        price: Number(data.price) || 0,
        discount: Number(data.discount) || 0,
        currency: data.currency,
        images: data.images[0] || null,
        category: data.category,
        subCategory: data.subCategory,
        condition: data.condition,
        size: data.size,
        gender:  data?.gender || null,
        brand: data?.brand || null,
        color: data?.color || null,
        material: data?.material || null,
        location:  data.location,
        views:  data.views,
        createdAt: data.createdAt?.toMillis?.() || Date.now(),
      }});
      console.log("✅ Product added to Algolia:", objectID);
    } catch (err) {
      console.error("❌ Error adding to Algolia:", err);
    }
  })