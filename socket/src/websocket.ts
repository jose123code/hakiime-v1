import 'dotenv/config'
import * as http from "http";
import { Server, Socket } from 'socket.io';
import {CustomSocket, authenticateWebSocket } from "./jwt";
import {listeners} from "./listenners/ws";
import { logger } from "./logger";

import { onlineDataManager } from "./jojo/hiskool/online";
import {syncAwardsFromDb, syncAwardsFromDb2, syncCategoriesFromDb, syncNominiesFromDb } from './connection/mysql';
import { asyncWrap } from './utils';



// Data structure to store active WebSocket connections
// const activeConnections: Map<string, WebSocket> = new Map();
// Function to set up WebSocket server
export function setupWebSocketServer(server: http.Server) {
  // Create a WebSocket server using the HTTP server
  const io = new Server(server,{
    cors: {
      origin: '*',
      // origin: /\.hkmcode\.(com|net|org)$/,
      methods: ['GET', 'POST'],
      allowedHeaders: ['X-Requested-With','content-type'],
      credentials: true,
    },
  
  });
  



  io.use((socket,next)=>{
    return authenticateWebSocket(socket, next);
  })
  // Attach WebSocket authentication middleware
  io.on("connection", (socket:Socket) => {
    logger.info(`New client connected. Socket ID: ${socket.id}`);
    asyncWrap(async (init)=>{
     await init.updateStatus();
    },{
      updateStatus:async ()=>{
        await onlineDataManager.updateUserStatus((socket as CustomSocket).payload!.data.userId,"none",socket.id,true)
          // syncAwardsFromDb2()
        await syncCategoriesFromDb()
        await syncAwardsFromDb()
        await syncNominiesFromDb()
      }
    })
   
    // logger.info(io.of("/").adapter);

         // Attach WebSocket event handlers for each listener
         for (const listenerName in listeners) {
          if (Object.prototype.hasOwnProperty.call(listeners, listenerName)) {
            const setupListener = listeners[listenerName];
            setupListener(socket,io);
          }
        }
     
  });

  
}
