import { logger } from "../../logger";
import {Server} from 'http';

// Event listener for server errors
export function onServerError(error: NodeJS.ErrnoException,port:number): void {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
      case 'EACCES':
        logger.error(bind + ' requires elevated privileges')
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  // Event listener for server listening
 export function onServerListening(server:Server): void {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
    logger.info('Listening on ' + bind);
  }