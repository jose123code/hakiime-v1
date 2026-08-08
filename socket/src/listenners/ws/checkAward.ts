
import {  Server, Socket } from 'socket.io';
import { logger } from '../../logger';


export function checkAwardListener(socket: Socket,io:Server) {
  // WebSocket listener 2 setup and event handling
  socket.on("check_award", (message: string) => {
   
  });

  // Add more event listeners as needed
}
