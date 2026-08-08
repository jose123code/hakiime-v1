import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { logger } from "./logger";
import TokenManager from "./token";




// Interface for the payload sent as a response upon successful authentication
export interface AuthenticationResponsePayload {
    message: string;
    data: any;
    token: string;
    public: boolean;
  }
// Define a custom Socket interface that extends the default Socket interface
export interface CustomSocket extends Socket {
  payload?: AuthenticationResponsePayload;
}
// export type nextdefault = 
// Middleware to handle WebSocket authentication
export const authenticateWebSocket = (
  socket: Socket,
  next: { (err?: ExtendedError | undefined): void; (arg0: Error | undefined): void; }
) => {
  // Check if the token is provided in the query string (e.g., http://localhost:3000/?token=your-token)
  const token = socket.handshake.query.token as string;
  if (!token) {
    logger.info(`New client ${socket.id}: Authentication Error!`);

    return next(new Error("Unauthorized"));
  }

  const verificationResult = TokenManager.verifyToken(token);
  if (verificationResult) {


      if (TokenManager.isExpired(token)) {
        logger.info(`New client ${socket.id}: Authentication Error!`);
        return next(new Error("Unauthorized"));
      } else {
        if("public" in verificationResult){
          const payload: AuthenticationResponsePayload = {
            message: "Authentication successful",
            data: {
              userId: verificationResult.userId, // Adjust as needed based on your payload content
              // Include additional data as needed in the payload response
            },
            public: true,
            token:token
          };
          // Store the validated token on the socket object for later use if needed
          (socket as CustomSocket).payload = payload;
          next();
        }else{
          const payload: AuthenticationResponsePayload = {
            message: "Authentication successful",
            data: {
              userId: verificationResult.userId, // Adjust as needed based on your payload content
              // Include additional data as needed in the payload response
            },
            public:false,
            token:token
          };
          // Store the validated token on the socket object for later use if needed
          (socket as CustomSocket).payload = payload;
          next();
        }
        
      }
  } else {
    logger.info(`New client ${socket.id}: Authentication Error!`);
    return next(new Error("Unauthorized"));
  }
  
};
