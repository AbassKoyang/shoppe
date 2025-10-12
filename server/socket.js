import { Server } from "socket.io";
import { db } from "./firebase-admin.js";

export function handleSocketEvents(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinChat", async ({ productId, buyerId, sellerId }) => {
      const roomId = `${productId}_${buyerId}_${sellerId}`;

      socket.join(roomId);
      console.log(`✅ ${socket.id} joined chat room: ${roomId}`);
    });

    socket.on("sendMessage", async ({ productId, buyerId, sellerId, senderId, text }) => {
      const roomId = `${productId}_${buyerId}_${sellerId}`;
      const messageData = {
        text,
        senderId,
        createdAt: new Date(),
      };

      // Create chat doc if it doesn't exist (only when first message is sent)
      await db.collection("chats").doc(roomId).set(
        { productId, buyerId, sellerId, createdAt: new Date() },
        { merge: true }
      );

      // Add message to the chat
      await db.collection("chats").doc(roomId).collection("messages").add(messageData);

      socket.to(roomId).emit("newMessage", { ...messageData, roomId });
    });

    socket.on("disconnect", () => console.log("❌ Disconnected:", socket.id));
  });
}