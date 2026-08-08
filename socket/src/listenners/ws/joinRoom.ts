

import { Server,Socket } from "socket.io";
import { userJoin, getRoomUsers, formatMessage, botName } from "../../utils";


export function JoinRoomListener(socket: Socket, io:Server) {
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
    
        socket.join(user.room);
    
        // Welcome current user
        socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));
    
        // Broadcast when a user connects
        socket.broadcast
          .to(user.room)
          .emit(
            "message",
            formatMessage(botName, `${user.username} has joined the chat`)
          );
    
        // Send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      });

  // Add more event listeners as needed
}
