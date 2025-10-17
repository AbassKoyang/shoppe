import { Server } from "socket.io";
import { db } from "./firebase-admin.js";

export function handleSocketEvents(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinChat", async ({ productId, buyerId, sellerId }) => {
      const roomId = `${productId}_${buyerId}_${sellerId}`;
      socket.join(roomId);
      // Remember the last joined room for disconnect handling
      socket.data.roomId = roomId;
      console.log(`✅ ${socket.id} joined chat room: ${roomId}`);
      // Broadcast presence on join to ensure peers see online without a separate emit
      socket.to(roomId).emit('user-online');
    });

    socket.on('userOnline', ({ productId, buyerId, sellerId }) => {
      const roomId = `${productId}_${buyerId}_${sellerId}`;
      console.log(`🟢 userOnline from ${socket.id} -> room ${roomId}`);
      if (roomId) socket.to(roomId).emit('user-online');
    })
    socket.on('userOffline', ({ productId, buyerId, sellerId }) => {
      const roomId = `${productId}_${buyerId}_${sellerId}`;
      console.log(`⚪ userOffline from ${socket.id} -> room ${roomId}`);
      if (roomId) socket.to(roomId).emit('user-offline');
    })

    socket.on('userTyping', (payload) => {
      const roomId = typeof payload === 'string'
        ? payload
        : `${payload?.productId}_${payload?.buyerId}_${payload?.sellerId}`;
      console.log(`✍️ userTyping from ${socket.id} -> room ${roomId}`);
      if (roomId) socket.to(roomId).emit('user-typing');
    })
    socket.on('userStopTyping', (payload) => {
      const roomId = typeof payload === 'string'
        ? payload
        : `${payload?.productId}_${payload?.buyerId}_${payload?.sellerId}`;
      console.log(`🛑 userStopTyping from ${socket.id} -> room ${roomId}`);
      if (roomId) socket.to(roomId).emit('user-stop-typing');
    })

    socket.on("sendMessage", async ({ productId, buyerId, sellerId, participants, senderId, text, images }) => {
      const roomId = `${productId}_${buyerId}_${sellerId}`;
      try {
        let uploadedUrls = [];

      uploadedUrls = Array.isArray(images) ? images : [];
      const messageData = {
        text,
        senderId,
        timestamp: new Date(),
        images: uploadedUrls,
        edited: false,
      };

      const docRef = db.collection('chats').doc(roomId);
      const docSnapshot = await docRef.get();
      if(docSnapshot.exists){
      await db.collection("chats").doc(roomId).collection("messages").add(messageData);
      } else {
      await db.collection("chats").doc(roomId).set(
        { productId, buyerId, sellerId, participants, createdAt: new Date(), archived: false }
      );
      await db.collection("chats").doc(roomId).collection("messages").add(messageData);
    }


      socket.to(roomId).emit("newMessage", { ...messageData, roomId });
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("disconnect", () =>{
      console.log("❌ Disconnected:", socket.id);
      const roomId = socket.data?.roomId;
      if (roomId) {
        // Notify peers that this user went offline
        socket.to(roomId).emit('user-offline');
      }
    });
  });
}