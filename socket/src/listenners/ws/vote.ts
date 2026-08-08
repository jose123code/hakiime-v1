

import { Server } from "socket.io";
import { CustomSocket } from "../../jwt";
import { vote } from "../../jojo/vote";
import { logger } from "../../logger";
import { asyncWrap } from "../../utils";
import { nominieDataManager } from "../../jojo";


export function VoteListener(socket: CustomSocket, io:Server) {
    socket.on("vote", (code) => {
        logger.info("prepared code: "+code);
        if(socket.payload?.public === false){
            logger.info("Connected user validate: TRUE:");

            const userId = socket.payload?.data.userId;
            const con ={
                fun:vote,
                args:[code,userId],
                socket:socket,
                log:logger
            } 
            asyncWrap(async (hlp) => {
                const r =await hlp.fun(hlp.args[0],hlp.args[1]);
                if(r == true||r?.categ>0){

                    hlp.socket.emit('vots','ok');
                    hlp.socket.broadcast.emit('voted', JSON.stringify({id:hlp.args[0],votes:1,name:r.name,categ:r.categ}));
                }else{
                    hlp.log.info("Voting failed: TRUE:");
                    hlp.socket.emit('vots','failed');

                }
              }, con);
        }else{
            var fun = {
                nominee:nominieDataManager,
                code: code
            };

            asyncWrap(async (l)=>{
                const nomin = await l.nominee.getNominie(l.code);
                if(nomin){
                    socket.emit("login",JSON.stringify({code,name:nomin.name}));
                }
            },fun)
            logger.info("Login emit code: "+code);
          
        }

      });

  // Add more event listeners as needed
}
