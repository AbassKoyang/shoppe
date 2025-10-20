import { db, FieldValue } from '../firebase-admin';
import { Transaction, TransactionStatus } from '../types';

class TransactionService {
  private collection = db.collection('transactions');
  private productsCollection = db.collection('products');

  // Create transaction
  async createTransaction(data: Omit<Transaction, 'id' | 'createdAt'>) {
    const transaction = {
      ...data,
      createdAt: new Date(),
    };

    const docRef = await this.collection.add(transaction);
    return { id: docRef.id, ...transaction };
  }

  // Get transaction by ID
  async getTransaction(id: string): Promise<Transaction | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Transaction;
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

  // Update product status
  async updateProductStatus(productId: string, status: string) {
    await this.productsCollection.doc(productId).update({
      status,
      updatedAt: new Date()
    });
  }
}

export const transactionService = new TransactionService();