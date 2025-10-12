import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from 'cors';
import { handleSocketEvents } from "./socket.js";

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Welcome to server');
})

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "useshoppe.vercel.app"], 
      methods: ["GET", "POST"],
    },
});

handleSocketEvents(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Socket.IO Server running on ${PORT}`));