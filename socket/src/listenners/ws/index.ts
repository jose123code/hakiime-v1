import { Server, Socket } from 'socket.io';
import { messageListener } from './helloListenners';
import { disconnectListener } from './disconnect';
import { JoinRoomListener } from './joinRoom';
import { chatListener } from './chatMessage';
import { checkAwardListener } from './checkAward';
import { VoteListener } from './vote';



interface ListenerObject {
    [key: string]: (socket: Socket,io:Server) => void;
  }
export const listeners: ListenerObject = {
    message:messageListener,
    disconnect: disconnectListener,
    chat:chatListener,
    join:JoinRoomListener,
    checkward: checkAwardListener,
    vote: VoteListener
}