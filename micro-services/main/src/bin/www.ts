import "reflect-metadata";
import debug from "debug";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";

import { runApp } from "../app";
import { container } from "../inversify.config";
import { MongoDBManager } from "../services/mongodb.manager";
import { INTERFACE_TYPE } from "../utils";

import { Server } from 'socket.io';
import { doAction, eventManager } from "../common";
import * as init from "../common/event-init";
import path from "path";
import { MongoDBStore } from "../services/mongodb.session.store";
import { ISessionRepository } from "../interfaces";


dotenv.config({ path: path.join(__dirname, '../../.env') });
const app = express();
const dbug = debug('android:server');
const PORT = process.env.PORT || 3000;

app.set('port', PORT);

import responseTime from "response-time";
import { StatsD } from "node-statsd";
import { HkmCodepowerdBy, shouldCompress } from "../common/middlewares";
import compression from "compression";

var stats = new StatsD()

stats.socket.on('error', function (error) {
    console.error(error.stack)
})

app.use(responseTime(function (req: Request, res: Response, time) {
    var stat = (req.method + req.url).toLowerCase()
        .replace(/[:.]/g, '')
        .replace(/\//g, '_')
    stats.timing(stat, time)
}))

app.use(compression({ filter: shouldCompress }))
app.use(HkmCodepowerdBy)

const server = http.createServer(app);

const io = new Server(server);




async function serverApp() {
    try {
        const mongoDBManager = container.get<MongoDBManager>(INTERFACE_TYPE.MongoDBManager);
        await mongoDBManager.connect();

        const sessionRepository = container.get<ISessionRepository>(INTERFACE_TYPE.SessionRepository);

        const mongoDBStore = new MongoDBStore(sessionRepository);

        const appServer = runApp(app, io, mongoDBManager, mongoDBStore);
        // Global middleware for all Socket.IO events
        io.use((socket, next) => {
            eventManager.setSharedContext({ io: socket, mongodb: mongoDBManager }, null, null);
            init.Init();

            doAction('init');
            // Call next() to proceed to the next middleware or event handler
            next();
        });
        server.listen(PORT);
        server.on('error', onError);
        server.on('listening', onListening);
    } catch (error) {
        console.error("Error occurred while starting the server:", error);
    }
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + PORT;
    dbug('Listening on ' + bind);
}

// Set up a connection event in Socket.io
io.on('connection', (socket) => {

    console.log('A user connected');
    // console.log(socketInfo(socket));

    // Handle custom events
    socket.on('chat message', (msg) => {
        console.log(`Message: ${msg}`);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });

    // Handle disconnect event
    socket.on('disconnect', () => {

        console.log('User disconnected');
    });
});



serverApp().then(() => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + PORT;
    console.log('Server is up on:' + bind);
}).catch(err => {
    console.error('Error starting server:', err);
});
