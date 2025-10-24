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
    origin: ["https://localhost:3000", "https://useshoppe.vercel.app"], // Added https://
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

app.post('/api/notification', async (req: Request, res: Response) => {
  try {
    const {receiverId, chatId, message, type} = req.body;
    const receiverDoc = await db.collection('users').doc(receiverId).get();
      const tokens = receiverDoc.data()?.fcmTokens;
      console.log(tokens);
      if(tokens){
        for (const token of tokens){
          await messaging.send({
            notification: {
              title: "New Message ✉️",
              body: message.length > 50 ? message.slice(0,50) + "..." : message,
              imageUrl: 'https://useshoppe.vercel.app/icon-512.png',
            },
            data: {
              chatId,
              type: type,
              url: `http://localhost:3000/chat/${chatId}`
            },
            webpush: {
              fcmOptions: { link: `http://localhost:3000/chat/${chatId}` },
             },
            token: token,
          })
        }
    console.log("notification sent to:", receiverId)
    } else {
      console.log("notification not sent. No fcm token for user:", receiverId)
    }
  } catch (error) {
    console.error("failed to send notification", error)
  }
})


app.post('/api/orders/:orderId/confirm-receipt', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { buyerId } = req.body;
    console.log(orderId, buyerId);

    const order = await transactionService.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const transaction = await transactionService.getTransaction(order.transactionDetails.id || '');
    console.log(transaction)
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.buyerId !== buyerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Transaction already processed' });
    }

    const sellerDoc = await db.collection('users').doc(transaction.sellerId).get();
    const seller = { id: sellerDoc.id, ...sellerDoc.data() } as User;
    console.log(seller)

    if (!seller.bankDetails?.recipientCode) {
      console.log("no bank details")
      return res.status(400).json({ error: 'Seller payment details not configured' });
    }

    const transferReference = `TRANSFER_${transaction.id}_${Date.now()}`;
    // const transfer = await paystackService.transferFunds({
    //   amount: transaction.sellerAmount,
    //   recipient: seller.bankDetails.recipientCode,
    //   reason: `Payment for product ${transaction.productId}`,
    //   reference: transferReference,
    // });
    // console.log(transferReference);

    // Update transaction
    await transactionService.updateTransactionStatus(transaction.id || '', 'released', {
      paystackTransferId: transferReference,
    });

    await transactionService.updateOrderStatus(orderId, 'completed', 'sold', 'released');

    // Update product status to sold
    await transactionService.updateProductStatus(transaction.productId, 'sold');
    await notificationService.notifyReceiptConfirmed(seller.id || '', order.productDetails.title, order.transactionDetails.sellerAmount, order.id || '')


    res.json({
      success: true,
      message: 'Payment released to seller',
      transaction: {
        id: transaction.id,
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