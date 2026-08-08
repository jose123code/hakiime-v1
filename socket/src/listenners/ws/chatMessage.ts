

import { Server,Socket } from "socket.io";
import {formatMessage, getCurrentUser, User } from "../../utils";


export function chatListener(socket: Socket, io:Server) {
    // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id) as User;

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Add more event listeners as needed
}
