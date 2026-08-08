

import { Server,Socket } from "socket.io";
import { getRoomUsers, formatMessage, botName, userLeave, asyncWrap } from "../../utils";
import { onlineDataManager } from "../../jojo/hiskool/online";
import { CustomSocket } from "../../jwt";
import { quitRedis } from "../../connection/redis_om";
import { closeMysql } from "../../connection/mysqlConn";
import { logger } from "../../logger";


export function disconnectListener(socket: Socket, io:Server) {
      // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    const onl = {
      manager: onlineDataManager,
      socket:socket,
      quit:()=>{quitRedis();}
    }
    asyncWrap(async (onli) => {
      await onli.manager.updateUserStatus(onli.socket.payload!.data.userId,"none",onli.socket.id,false)
      // onli.quit();
    }, onl);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }

    // closeMysql()
  });

  // Add more event listeners as needed
}
