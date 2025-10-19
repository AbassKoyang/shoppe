import { Server, Socket } from "socket.io";
import { db } from "./firebase-admin";
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
      
      // Remember the last joined room for disconnect handling
      socket.data.roomId = roomId;
      console.log(`✅ ${socket.id} joined chat room: ${roomId}`);
      
      // Broadcast presence on join to ensure peers see online without a separate emit
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
          timestamp: messageData.timestamp.toDate() // Convert to Date for client
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
      const roomId = socket.data?.roomId;
      
      if (roomId) {
        // Notify peers that this user went offline
        socket.to(roomId).emit('user-offline');
      }
    });
  });
}