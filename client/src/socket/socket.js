// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://incident-tracking-system.onrender.com";

// Create a single socket instance
export const socket = io(SOCKET_URL, {
  transports: ["websocket"], // optional, forces WebSocket
});

// Optional: debug
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});
