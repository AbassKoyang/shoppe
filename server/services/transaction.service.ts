import dotenv from 'dotenv';
dotenv.config();
import { db, FieldValue } from '../firebase-admin';
import { OrderDataType, OrderStatus, ProductStatus, Transaction, TransactionStatus } from '../types';
import {algoliasearch} from 'algoliasearch'

class TransactionService {
  private collection = db.collection('transactions');
  private productsCollection = db.collection('products');
  private ordersCollection = db.collection('orders');
  private getKeys() {
    return {
      ALGOLIA_APP_ID: process.env.PUBLIC_ALGOLIA_APP_ID!,
      ALGOLIA_WRITE_API_KEY: process.env.PUBLIC_ALGOLIA_WRITE_API_KEY!,
      ALGOLIA_SEARCH_API_KEY: process.env.PUBLIC_ALGOLIA_SEARCH_API_KEY!,
    };
  }
  private ALGOLIA_INDEX_NAME = "products";
  private client = algoliasearch(this.getKeys().ALGOLIA_APP_ID, this.getKeys().ALGOLIA_WRITE_API_KEY);


  // Create transaction
  async createTransaction(data: Omit<Transaction, 'id' | 'createdAt'>) {
    const transaction = {
      ...data,
      createdAt: new Date(),
    };

    const docRef = await this.collection.add(transaction);
    return { id: docRef.id, ...transaction } as  Transaction;
  }
  async createOrder(data: OrderDataType) {
    const order = {
      ...data,
      createdAt: new Date(),
    };

    const docRef = await this.ordersCollection.add(order);
    return { id: docRef.id, ...order };
  }

  // Get transaction by ID
  async getTransaction(id: string): Promise<Transaction | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Transaction;
  }

  async getOrder(id: string): Promise<OrderDataType | null> {
    const doc = await this.ordersCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as OrderDataType;
  }

  // Get transaction by Paystack reference
  async getTransactionByReference(reference: string): Promise<Transaction | null> {
    const snapshot = await this.collection
      .where('paystackReference', '==', reference)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Transaction;
  }

  // Update transaction status
  async updateTransactionStatus(id: string, status: TransactionStatus, additionalData?: any) {
    const updateData: any = {
      status,
      updatedAt: new Date(),
      ...additionalData,
    };

    if (status === 'released') {
      updateData.releasedAt = new Date();
    }

    await this.collection.doc(id).update(updateData);
  }

  async updateOrderStatus(id: string, orderStatus: OrderStatus, productStatus : ProductStatus, transactionStatus: TransactionStatus,  additionalData?: any) {
    const updateData: any = {
      status: orderStatus,
      'productDetails.status': productStatus,
      'transactionDetails.status': transactionStatus,
      updatedAt: new Date(),
      ...additionalData,
    };

    if (transactionStatus === 'released') {
      updateData.releasedAt = new Date();
    }

    await this.ordersCollection.doc(id).update(updateData);
  }

  async updateProductStatus(productId: string, status: string) {
    await this.productsCollection.doc(productId).update({
      status,
      updatedAt: new Date()
    });
    await this.client.partialUpdateObject({
        indexName: this.ALGOLIA_INDEX_NAME,
        objectID: productId,
        attributesToUpdate : {
        status: status,
        updatedAt: Date.now(),
      }});
  }
}

export const transactionService = new TransactionService();