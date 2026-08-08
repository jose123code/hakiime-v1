import { CustomSocket } from "../../jwt";
import { logger } from "../../logger";
import {  Server, Socket } from 'socket.io';


export function messageListener(socket: Socket,io:Server) {
  // WebSocket listener 2 setup and event handling
  socket.on("message", (message: string) => {
    logger.debug(`Received message from client with token "${(socket as CustomSocket).payload!.token}": ${message}`);
          socket.broadcast.emit('message', message);
  });

  // Add more event listeners as needed
}