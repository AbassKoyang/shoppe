import { Server, Socket } from "socket.io";
import { db, messaging } from "./firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

// Define types for socket events
interface JoinChatPayload {
  productId: string;
  buyerId: string;
  sellerId: string;
}

interface UserStatusPayload {
  productId: string;
  buyerId: string;
  sellerId: string;
}

interface TypingPayload {
  productId?: string;
  buyerId?: string;
  sellerId?: string;
}

interface SendMessagePayload {
  productId: string;
  buyerId: string;
  sellerId: string;
  participants: string[];
  senderId: string;
  text: string;
  images?: string[];
}

interface MessageData {
  text: string;
  senderId: string;
  timestamp: Timestamp;
  images: string[];
  edited: boolean;
}

interface ChatDocument {
  productId: string;
  buyerId: string;
  sellerId: string;
  participants: string[];
  createdAt: Timestamp;
  archived: boolean;
}

// Extend socket data interface
interface SocketData {
  roomId?: string;
}

export function handleSocketEvents(io: Server): void {
  io.on("connection", (socket: Socket<any, any, any, SocketData>) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinChat", async ({ productId, buyerId, sellerId }: JoinChatPayload) => {
      const roomId = `${productId}_${buyerId}_${sellerId}`;
      socket.join(roomId);
      
      socket.data.roomId = roomId;
      console.log(`✅ ${socket.id} joined chat room: ${roomId}`);
      
      socket.to(roomId).emit('user-online');
    });

    socket.on('userOnline', ({ productId, buyerId, sellerId }: UserStatusPayload) => {
      const roomId = `${productId}_${buyerId}_${sellerId}`;
      console.log(`🟢 userOnline from ${socket.id} -> room ${roomId}`);
      if (roomId) socket.to(roomId).emit('user-online');
    });

    socket.on('userOffline', ({ productId, buyerId, sellerId }: UserStatusPayload) => {
      const roomId = `${productId}_${buyerId}_${sellerId}`;
      console.log(`⚪ userOffline from ${socket.id} -> room ${roomId}`);
      if (roomId) socket.to(roomId).emit('user-offline');
    });

    socket.on('userTyping', (payload: string | TypingPayload) => {
      const roomId = typeof payload === 'string'
        ? payload
        : `${payload?.productId}_${payload?.buyerId}_${payload?.sellerId}`;
      console.log(`✍️ userTyping from ${socket.id} -> room ${roomId}`);
      if (roomId) socket.to(roomId).emit('user-typing');
    });

    socket.on('userStopTyping', (payload: string | TypingPayload) => {
      const roomId = typeof payload === 'string'
        ? payload
        : `${payload?.productId}_${payload?.buyerId}_${payload?.sellerId}`;
      console.log(`🛑 userStopTyping from ${socket.id} -> room ${roomId}`);
      if (roomId) socket.to(roomId).emit('user-stop-typing');
    });

    socket.on("sendMessage", async ({ 
      productId, 
      buyerId, 
      sellerId, 
      participants, 
      senderId, 
      text, 
      images 
    }: SendMessagePayload) => {
      const roomId = `${productId}_${buyerId}_${sellerId}`;
      
      try {
        const uploadedUrls: string[] = Array.isArray(images) ? images : [];
        
        const messageData: MessageData = {
          text,
          senderId,
          timestamp: Timestamp.now(),
          images: uploadedUrls,
          edited: false,
        };

        const docRef = db.collection('chats').doc(roomId);
        const docSnapshot = await docRef.get();
        
        if (docSnapshot.exists) {
          await db.collection("chats").doc(roomId).collection("messages").add(messageData);
        } else {
          const chatData: ChatDocument = {
            productId,
            buyerId,
            sellerId,
            participants,
            createdAt: Timestamp.now(),
            archived: false,
          };
          
          await db.collection("chats").doc(roomId).set(chatData);
          await db.collection("chats").doc(roomId).collection("messages").add(messageData);
        }

        socket.to(roomId).emit("newMessage", { 
          ...messageData, 
          roomId,
          timestamp: messageData.timestamp.toDate()
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });


    //Notification events

    socket.on("sendNewMessageNotification", async ({receiverId, message, type, chatId}:{receiverId: string; message: string; type: string; chatId: string}) => {
      const receiverDoc = await db.collection('users').doc(receiverId).get();
      const token = receiverDoc.data()?.token;
      if(token){
  
      await messaging.send({
        notification: {
          title: "New Message ✉️",
          body: message.length > 50 ? message.slice(0,50) + "..." : message,
        },
        data: {
          chatId,
          type: type,
        },
        webpush: {
          fcmOptions: { link: `http://localhost:3000/chat/${chatId}` },
         },
        token: token,
      })
    console.log("notification sent to:", receiverId)
    } else {
      console.log("notification not sent. No fcm token for user:", receiverId)
    }

    io.to(receiverId).emit("newMessageNotification", {receiverId, message, type, chatId})
    console.log('Message sent to:', receiverId);
    })

    socket.on("join", (userId: string) => {
      socket.join(userId);
      console.log("User joined:", userId)
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
      const roomId = socket.data?.roomId;
      
      if (roomId) {
        socket.to(roomId).emit('user-offline');
      }
    });
  });
}