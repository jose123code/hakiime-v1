// import WebSocket from "ws";
import { logger } from "./logger";
import * as io from 'socket.io-client';
import TokenManager from "./token";

const payload = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (3600 * 9), // Expiration time (1 hour)
    uid: 'user-123', // Firebase user ID
    userId: "user-123",
    public: false
    // ... other custom claims
  };
  

const token = TokenManager.generateToken(payload); // Replace with your payload
// const client = new WebSocket(`wss://service.hkmcode.com:445/?token=${token}`);

// logger.info(`TOKEN: ${token}`);
// client.onopen = () => {
//   logger.info("Connected to WebSocket server");
//   client.send("Hello, WebSocket server!");
// };

// client.onmessage = (message) => {
//   logger.info(`Received message from server: ${message.data}`);
// };

// client.onclose = () => {
//   logger.info("Connection closed");
// };

// client.ts
// logger.info(token)

const socket = io.connect(`http://localhost:3000?token=${token}`);
// const socket = io.connect(`https://service.hkmcode.com?token=${token}`);


socket.on('connect', () => {
   logger.info("Connected to WebSocket server");
   
});

// // socket.emit('vote',"6ce9bbfc1f793a8");

socket.on('message', (data) => {
  console.log('Received message from server:', data);
});
socket.on('voted', (data) => {
  console.log('Received message from server:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
