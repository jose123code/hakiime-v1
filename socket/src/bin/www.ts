import dotenv from 'dotenv';
import { setupWebSocketServer } from '../websocket';
import { normalizePort } from "../utils";
import express from 'express';
import http from 'http';
import cors from 'cors';
import config from '../config';

const port: number = normalizePort(config.serverOptions.port as unknown as string) as number;

const app = express();
const server = http.createServer(app);
// Enable CORS for all routes
app.use(cors());
// app.use((_req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   next();
// });
// Load environment variables from .env file
dotenv.config();
app.get('/', (req, res) => {
  res.send('Hello World!')
})
// Get the port from the environment or set it to 3000 if not available


// // Create the HTTP server
// const server: http.Server = http.createServer();
// const server:https.Server = https.createServer({
//     cert: fs.readFileSync('/etc/apache2/ssl/hkmcode.crt'),
//     key: fs.readFileSync('/etc/apache2/ssl/hkmcode.key')
//   });




// Set up event listeners for the server
// server.on('error', (error: NodeJS.ErrnoException)=>onServerError(error,port));
// server.on('listening', ()=>onServerListening(server));

// Start the server, listening on the specified port
const sv = server.listen(port,config.serverOptions.host,()=>{
  console.log(`socket app listening on port ${port}`)
});

setupWebSocketServer(server);