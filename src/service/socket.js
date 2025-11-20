// src/socket.js

import { io } from "socket.io-client";

// Replace this with the URL of your Node.js/Socket.IO server
// Using 'http://localhost:3000' for development
const SERVER_URL = process.env.VUE_APP_SOCKET_URL || "http://localhost:3000";

// 1. Initialize the socket connection.
// We use autoConnect: true here, but you could set it to false 
// if you only want to connect on specific pages.
export const socket = io(SERVER_URL, {
    // Optional: Use websockets only for a cleaner connection
    transports: ["websocket"], 
    // You might also need to include your authentication token in the headers
    // auth: { token: localStorage.getItem('authToken') }
});

// Optional: Global connection logging
socket.on("connect", () => {
    console.log("Socket.IO: Connected to server. ID:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.log("Socket.IO: Disconnected. Reason:", reason);
});