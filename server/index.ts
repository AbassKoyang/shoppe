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

    const buyerDoc = await db.collection('users').doc(buyerId).get();
    if (!buyerDoc.exists) {
      return res.status(404).json({ error: 'Buyer not found' });
    }
    const buyer = { id: buyerDoc.id, ...buyerDoc.data() } as User;


    if (card.userId !== buyerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const productDoc = await db.collection('products').doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const product = { id: productDoc.id, ...productDoc.data() } as ProductType;

    if (product.status !== 'available') {
      return res.status(400).json({ error: 'Product is not available' });
    }

    if (product.sellerId === buyerId) {
      return res.status(400).json({ error: 'Cannot buy your own product' });
    }

    const amountInKobo = parseInt(product.price) * 100;
    const { platformFee, sellerAmount } = paystackService.calculateAmounts(amountInKobo);

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

    if (paymentResponse.status && paymentResponse.data.status === 'success') {
      const reference = paymentResponse.data.reference;
      
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

        await notificationService.queueEmail({
          to: buyer.profile.email,
          name: buyer.profile.name,
          message: `Your payment for "${product.title}" has been received, payment will be released to seller when the item is delivered`,
          link: `useshoppe.vercel.app/orders/${order.id}`,
          subject: '⏳ Order Pending'
        })

        await notificationService.queueEmail({
          to: seller.profile.email,
          name: seller.profile.name,
          message: `${buyer.profile.name} just bought "${product.title}"`,
          link: `useshoppe.vercel.app/orders/${order.id}`,
          subject: '🎉 New Purchase!'
        })

        await notificationService.notifyProductPurchase(seller.id || '', buyer.profile.name, product.title ,order.id)
        await notificationService.notifyOrderPending(buyer.id || '', product.title, order.id)

        console.log(order);

      res.json({
        success: true,
        message: 'Payment successful',
        order: {
          id: order.id,
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


app.post('/api/orders/:orderId/confirm-receipt', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { buyerId } = req.body;
    
    console.log('Confirming receipt:', { orderId, buyerId });

    if (!orderId || !buyerId) {
      return res.status(400).json({ error: 'Order ID and Buyer ID are required' });
    }

    const order = await transactionService.getOrder(orderId);
    if (!order) {
      console.error('❌ Order not found:', orderId);
      return res.status(404).json({ error: 'Order not found' });
    }

    const transaction = await transactionService.getTransaction(order.transactionDetails.id || '');
    if (!transaction) {
      console.error('Transaction not found:', order.transactionDetails.id);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    console.log('Transaction found:', {
      id: transaction.id,
      status: transaction.status,
      sellerId: transaction.sellerId,
      buyerId: transaction.buyerId,
    });

    if (transaction.buyerId !== buyerId) {
      console.error('Unauthorized: buyer mismatch');
      return res.status(403).json({ error: 'Unauthorized: You are not the buyer of this order' });
    }

    if (transaction.status !== 'pending') {
      console.error('Transaction already processed:', transaction.status);
      return res.status(400).json({ 
        error: 'Transaction already processed',
        currentStatus: transaction.status 
      });
    }

    const sellerDoc = await db.collection('users').doc(transaction.sellerId).get();
    if (!sellerDoc.exists) {
      console.error('Seller not found:', transaction.sellerId);
      return res.status(404).json({ error: 'Seller not found' });
    }

    const seller = { id: sellerDoc.id, ...sellerDoc.data() } as User;
    console.log('👤 Seller:', seller.id, seller.profile?.name);

    if (!seller.bankDetails?.recipientCode) {
      console.error('Seller has no bank details');
      return res.status(400).json({ 
        error: 'Seller payment details not configured',
        message: 'The seller needs to add their bank account before you can confirm receipt'
      });
    }

    const transferReference = `TRANSFER_${transaction.id}_${Date.now()}`;
    
    console.log('Initiating transfer:', {
      amount: transaction.sellerAmount,
      amountInNaira: transaction.sellerAmount / 100,
      recipient: seller.bankDetails.recipientCode,
      reference: transferReference,
    });

    let transferId = transferReference;

    console.log('Updating order status...');
    await transactionService.updateOrderStatus(orderId, 'completed', 'sold', 'released');

    console.log('Updating product status...');
    await transactionService.updateProductStatus(transaction.productId, 'sold');


    console.log('Updating transaction status...');
    await transactionService.updateTransactionStatus(transaction.id || '', 'released', {
      paystackTransferId: transferId,
      releasedAt: new Date().toISOString(),
    });

    console.log('Sending notification to seller...');

    await notificationService.queueEmail({
      to: seller.profile.email,
      name: seller.profile.name,
      message: `You received ₦${transaction.sellerAmount.toLocaleString()} for "${order.productDetails.title}"`,
      link: `useshoppe.vercel.app/orders/${orderId}`,
      subject: '🎉 Payment Released'
    })

    try {
      await notificationService.notifyReceiptConfirmed(
        seller.id || '', 
        order.productDetails.title, 
        transaction.sellerAmount / 100,
        order.id || ''
      );
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }

    console.log('Receipt confirmed successfully');

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
    console.error('Confirm receipt error:', error);
    res.status(500).json({ 
      error: 'Failed to confirm receipt',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


app.post('/api/orders/:orderId/mark-as-delivered', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { sellerId } = req.body;
    
    console.log('Marking order as  delivered:', { orderId, sellerId });

    if (!orderId || !sellerId) {
      return res.status(400).json({ error: 'Order ID and Seller ID are required' });
    }

    const order = await transactionService.getOrder(orderId);
    if (!order) {
      console.error('Order not found:', orderId);
      return res.status(404).json({ error: 'Order not found' });
    }

    const transaction = await transactionService.getTransaction(order.transactionDetails.id || '');
    if (!transaction) {
      console.error('Transaction not found:', order.transactionDetails.id);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    console.log('Transaction found:', {
      id: transaction.id,
      status: transaction.status,
      sellerId: transaction.sellerId,
      buyerId: transaction.buyerId,
    });

    if (transaction.sellerId !== sellerId) {
      console.error('Unauthorized: seller mismatch');
      return res.status(403).json({ error: 'Unauthorized: You are not the seller of this order' });
    }

    if (transaction.status !== 'pending') {
      console.error('Transaction already processed:', transaction.status);
      return res.status(400).json({ 
        error: 'Transaction already processed',
        currentStatus: transaction.status 
      });
    }

    const buyerDoc = await db.collection('users').doc(transaction.buyerId).get();
    if (!buyerDoc.exists) {
      console.error('Buyer not found:', transaction.sellerId);
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const buyer = { id: buyerDoc.id, ...buyerDoc.data() } as User;
    console.log('Buyer:', buyer.id, buyer.profile?.name);
    

    console.log('Updating order status...');
    await transactionService.updateOrderStatus(orderId, 'delivered', 'pending', 'pending');


    console.log('Sending notification to buyer...');
    await notificationService.queueEmail({
      to: buyer.profile.email,
      name: buyer.profile.name,
      message: `Your order for "${order.productDetails.title}" has been delivered and is on its way to you. Have you received "${order.productDetails.title}"? Confirm to release payment to seller`,
      link: `useshoppe.vercel.app/orders/${order.id}`,
      subject: '📦 Confirm Receipt'
    })

    try {
      await notificationService.notifyMarkAsDelivered(
        buyer.id || '', 
        order.productDetails.title, 
        order.id || ''
      );
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }

    console.log('Order marked as delivered successfully');

    res.json({
      success: true,
      message: 'Order marked as deliver',
      order: {
        id: orderId,
        status: 'delivered',
      }
    });

  } catch (error: any) {
    console.error('Error occured while marking order as delivered:', error);
    res.status(500).json({ 
      error: 'Failed to mark order as delivered',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/send-email", async (req: Request, res: Response) => {
  const { to, name, message, link, subject } = req.body;

  if (!to || !name || !message || !link || !subject) {
    return res.status(400).json({ error: "Missing fields" });
  }

  await notificationService.queueEmail({
    to,
    name,
    message,
    link,
    subject
  })

  res.json({ status: "queued" });
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
