import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';
import { handleSocketEvents } from "./socket";
import { transactionService } from "./services/transaction.service";
import { paystackService } from "./services/paystack.service";
import { db } from "./firebase-admin";
import crypto from 'crypto';
import { PaymentMethodType, ProductType, User } from "./types";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to server');
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://useshoppe.vercel.app"], // Added https://
    methods: ["GET", "POST"],
    credentials: true, // Optional: if you need to send cookies
  },
});

handleSocketEvents(io);
app.post('/api/products/:productId/buy', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { buyerId, card } = req.body;
    console.log(productId, buyerId, card)

    // Get buyer details
    const buyerDoc = await db.collection('users').doc(buyerId).get();
    if (!buyerDoc.exists) {
      return res.status(404).json({ error: 'Buyer not found' });
    }
    const buyer = { id: buyerDoc.id, ...buyerDoc.data() } as User;


    // Verify card belongs to buyer
    if (card.userId !== buyerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get product details
    const productDoc = await db.collection('products').doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const product = { id: productDoc.id, ...productDoc.data() } as ProductType;

    if (product.status !== 'available') {
      return res.status(400).json({ error: 'Product is not available' });
    }

    // Prevent buying own product
    if (product.sellerId === buyerId) {
      return res.status(400).json({ error: 'Cannot buy your own product' });
    }

    // Calculate amounts
    const amountInKobo = parseInt(product.price) * 100;
    const { platformFee, sellerAmount } = paystackService.calculateAmounts(amountInKobo);

    // Charge the card directly
    const paymentResponse = await paystackService.chargeAuthorization({
      email: card.email,
      amount: amountInKobo,
      authorization_code: card.authorisationCode,
      metadata: {
        productId,
        buyerId,
        sellerId: product.sellerId,
        buyerName: buyer.profile.name,
        productTitle: product.title,
        cardLast4: card.last4,
      },
    });
    console.log(paymentResponse);

    // Check if charge was successful
    if (paymentResponse.status && paymentResponse.data.status === 'success') {
      const reference = paymentResponse.data.reference;
      
      // Create transaction record
      const transaction = await transactionService.createTransaction({
        productId,
        sellerId: product.sellerId || '',
        buyerId,
        amount: amountInKobo,
        platformFee,
        sellerAmount,
        status: 'pending',
        paystackReference: reference,
      });
      console.log(transaction);


      const sellerDoc = await db.collection('users').doc(product?.sellerId || '').get();
      if (!sellerDoc.exists) {
        return res.status(404).json({ error: 'Seller not found' });
      }
      const seller = { id: sellerDoc.id, ...sellerDoc.data() } as User;
       // Update product status to pending
       await transactionService.updateProductStatus(productId, 'pending');

      const order = await transactionService.createOrder({
        buyerInfo: buyer,
        sellerInfo: seller,
        productDetails: product,
        transactionDetails: transaction,
        createdAt: new Date()
      })

      console.log(order);


      res.json({
        success: true,
        message: 'Payment successful',
        transaction: {
          id: transaction.id,
          amount: amountInKobo / 100,
          reference,
          status: 'pending',
        },
      });
    } else {
      res.status(400).json({
        error: 'Payment failed',
        message: paymentResponse.message || 'Unable to charge card',
      });
    }
  } catch (error: any) {
    console.error('Buy product error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET USER'S SAVED CARDS
// ============================================
app.get('/api/users/:userId/cards', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const cardsSnapshot = await db.collection('cards')
      .where('userId', '==', userId)
      .get();

    const cards = cardsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Don't expose authorization code to frontend
      authorisationCode: undefined,
    }));

    res.json({ cards });
  } catch (error: any) {
    console.error('Get cards error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// BUYER CONFIRMS RECEIPT
// ============================================
app.post('/api/transactions/:transactionId/confirm-receipt', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { buyerId } = req.body;

    // Get transaction
    const transaction = await transactionService.getTransaction(transactionId);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Verify buyer
    if (transaction.buyerId !== buyerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Transaction already processed' });
    }

    // Get seller details
    const sellerDoc = await db.collection('users').doc(transaction.sellerId).get();
    const seller = { id: sellerDoc.id, ...sellerDoc.data() } as User;

    if (!seller.bankDetails?.recipientCode) {
      return res.status(400).json({ error: 'Seller payment details not configured' });
    }

    // Transfer funds to seller
    const transferReference = `TRANSFER_${transactionId}_${Date.now()}`;
    const transfer = await paystackService.transferFunds({
      amount: transaction.sellerAmount,
      recipient: seller.bankDetails.recipientCode,
      reason: `Payment for product ${transaction.productId}`,
      reference: transferReference,
    });

    // Update transaction
    await transactionService.updateTransactionStatus(transactionId, 'released', {
      paystackTransferId: transfer.data.id,
    });

    // Update product status to sold
    await transactionService.updateProductStatus(transaction.productId, 'sold');

    res.json({
      success: true,
      message: 'Payment released to seller',
      transaction: {
        id: transactionId,
        status: 'released',
        sellerAmount: transaction.sellerAmount / 100,
        platformFee: transaction.platformFee / 100,
      },
    });
  } catch (error: any) {
    console.error('Confirm receipt error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET TRANSACTION DETAILS
// ============================================
app.get('/api/transactions/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const transaction = await transactionService.getTransaction(transactionId);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Get related product and user details
    const [productDoc, buyerDoc, sellerDoc] = await Promise.all([
      db.collection('products').doc(transaction.productId).get(),
      db.collection('users').doc(transaction.buyerId).get(),
      db.collection('users').doc(transaction.sellerId).get(),
    ]);

    res.json({
      transaction,
      product: productDoc.exists ? { id: productDoc.id, ...productDoc.data() } : null,
      buyer: buyerDoc.exists ? { id: buyerDoc.id, name: buyerDoc.data()?.name, email: buyerDoc.data()?.email } : null,
      seller: sellerDoc.exists ? { id: sellerDoc.id, name: sellerDoc.data()?.name, email: sellerDoc.data()?.email } : null,
    });
  } catch (error: any) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET USER'S TRANSACTIONS (AS BUYER OR SELLER)
// ============================================
app.get('/api/users/:userId/transactions', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.query; // 'buyer' or 'seller'

    let query;
    if (role === 'buyer') {
      query = db.collection('transactions').where('buyerId', '==', userId);
    } else if (role === 'seller') {
      query = db.collection('transactions').where('sellerId', '==', userId);
    } else {
      // Get both
      const [buyerSnapshot, sellerSnapshot] = await Promise.all([
        db.collection('transactions').where('buyerId', '==', userId).get(),
        db.collection('transactions').where('sellerId', '==', userId).get(),
      ]);

      const transactions = [
        ...buyerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), userRole: 'buyer' })),
        ...sellerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), userRole: 'seller' })),
      ];

      return res.json({ transactions });
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ transactions });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// // ============================================
// // PAYSTACK WEBHOOK (OPTIONAL - FOR MONITORING)
// // ============================================
// app.post('/api/webhooks/paystack', async (req: Request, res: Response) => {
//   try {
//     // Verify signature
//     const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
//       .update(JSON.stringify(req.body))
//       .digest('hex');

//     if (hash !== req.headers['x-paystack-signature']) {
//       return res.status(401).json({ error: 'Invalid signature' });
//     }

//     const event = req.body;

//     // Log transfer events for monitoring
//     if (event.event === 'transfer.success') {
//       console.log('Transfer successful:', event.data.reference);
//     } else if (event.event === 'transfer.failed') {
//       console.log('Transfer failed:', event.data.reference);
//     }

//     res.json({ status: 'success' });
//   } catch (error: any) {
//     console.error('Webhook error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

const PORT: number = parseInt(process.env.PORT || "4000", 10);

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});