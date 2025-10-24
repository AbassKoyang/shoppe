import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';
import { handleSocketEvents } from "./socket";
import { transactionService } from "./services/transaction.service";
import { paystackService } from "./services/paystack.service";
import { db, messaging } from "./firebase-admin";
import crypto from 'crypto';
import { PaymentMethodType, ProductType, User } from "./types";
import { notificationService } from './services/notification.service';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to server');
});

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["https://localhost:3000", "https://useshoppe.vercel.app", "http://localhost:3000"], 
    methods: ["GET", "POST"],
    credentials: true,
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
       const updatedProductDoc = await db.collection('products').doc(productId).get();
       const updatedProduct  = {id: updatedProductDoc.id, ...updatedProductDoc.data()} as ProductType;
        const order = await transactionService.createOrder({
          status: 'pending',
          buyerInfo: buyer,
          sellerInfo: seller,
          productDetails: updatedProduct,
          transactionDetails: transaction,
          createdAt: new Date()
        })

        await notificationService.notifyProductPurchase(seller.id || '', buyer.profile.name, product.title ,order.id)

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

//test notis endpoint

app.post('/api/orders/:orderId/confirm-receipt', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { buyerId } = req.body;
    
    console.log('🔍 Confirming receipt:', { orderId, buyerId });

    // Validate inputs
    if (!orderId || !buyerId) {
      return res.status(400).json({ error: 'Order ID and Buyer ID are required' });
    }

    // Get order
    const order = await transactionService.getOrder(orderId);
    if (!order) {
      console.error('❌ Order not found:', orderId);
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get transaction
    const transaction = await transactionService.getTransaction(order.transactionDetails.id || '');
    if (!transaction) {
      console.error('❌ Transaction not found:', order.transactionDetails.id);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    console.log('✅ Transaction found:', {
      id: transaction.id,
      status: transaction.status,
      sellerId: transaction.sellerId,
      buyerId: transaction.buyerId,
    });

    // Verify buyer
    if (transaction.buyerId !== buyerId) {
      console.error('❌ Unauthorized: buyer mismatch');
      return res.status(403).json({ error: 'Unauthorized: You are not the buyer of this order' });
    }

    // Check transaction status
    if (transaction.status !== 'pending') {
      console.error('⚠️ Transaction already processed:', transaction.status);
      return res.status(400).json({ 
        error: 'Transaction already processed',
        currentStatus: transaction.status 
      });
    }

    // Get seller details
    const sellerDoc = await db.collection('users').doc(transaction.sellerId).get();
    if (!sellerDoc.exists) {
      console.error('❌ Seller not found:', transaction.sellerId);
      return res.status(404).json({ error: 'Seller not found' });
    }

    const seller = { id: sellerDoc.id, ...sellerDoc.data() } as User;
    console.log('👤 Seller:', seller.id, seller.profile?.name);

    // Verify seller has bank details
    if (!seller.bankDetails?.recipientCode) {
      console.error('❌ Seller has no bank details');
      return res.status(400).json({ 
        error: 'Seller payment details not configured',
        message: 'The seller needs to add their bank account before you can confirm receipt'
      });
    }

    // Transfer funds to seller
    const transferReference = `TRANSFER_${transaction.id}_${Date.now()}`;
    
    console.log('💸 Initiating transfer:', {
      amount: transaction.sellerAmount,
      amountInNaira: transaction.sellerAmount / 100,
      recipient: seller.bankDetails.recipientCode,
      reference: transferReference,
    });

    let transferId = transferReference;

    // Update order status
    console.log('📝 Updating order status...');
    await transactionService.updateOrderStatus(orderId, 'completed', 'sold', 'released');

    // Update product status
    console.log('📦 Updating product status...');
    await transactionService.updateProductStatus(transaction.productId, 'sold');

    // Update transaction status
    console.log('💳 Updating transaction status...');
    await transactionService.updateTransactionStatus(transaction.id || '', 'released', {
      paystackTransferId: transferId,
      releasedAt: new Date().toISOString(),
    });

    // Send notification to seller
    console.log('🔔 Sending notification to seller...');
    try {
      await notificationService.notifyReceiptConfirmed(
        seller.id || '', 
        order.productDetails.title, 
        transaction.sellerAmount / 100, // Convert to Naira
        order.id || ''
      );
    } catch (notifError) {
      console.error('⚠️ Failed to send notification:', notifError);
      // Don't fail the entire request if notification fails
    }

    console.log('✅ Receipt confirmed successfully');

    res.json({
      success: true,
      message: 'Payment released to seller',
      transaction: {
        id: transaction.id,
        status: 'released',
        sellerAmount: transaction.sellerAmount / 100,
        platformFee: transaction.platformFee / 100,
        transferReference: transferId,
      },
      order: {
        id: orderId,
        status: 'completed',
      }
    });

  } catch (error: any) {
    console.error('❌ Confirm receipt error:', error);
    res.status(500).json({ 
      error: 'Failed to confirm receipt',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


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