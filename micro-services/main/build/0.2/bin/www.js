"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const debug_1 = __importDefault(require("debug"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const app_1 = require("../app");
const inversify_config_1 = require("../inversify.config");
const utils_1 = require("../utils");
const socket_io_1 = require("socket.io");
const common_1 = require("../common");
const init = __importStar(require("../common/event-init"));
const path_1 = __importDefault(require("path"));
const mongodb_session_store_1 = require("../services/mongodb.session.store");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const app = (0, express_1.default)();
const dbug = (0, debug_1.default)('android:server');
const PORT = process.env.PORT || 3000;
app.set('port', PORT);
const response_time_1 = __importDefault(require("response-time"));
const node_statsd_1 = require("node-statsd");
const middlewares_1 = require("../common/middlewares");
const compression_1 = __importDefault(require("compression"));
var stats = new node_statsd_1.StatsD();
stats.socket.on('error', function (error) {
    console.error(error.stack);
});
app.use((0, response_time_1.default)(function (req, res, time) {
    var stat = (req.method + req.url).toLowerCase()
        .replace(/[:.]/g, '')
        .replace(/\//g, '_');
    stats.timing(stat, time);
}));
app.use((0, compression_1.default)({ filter: middlewares_1.shouldCompress }));
app.use(middlewares_1.HkmCodepowerdBy);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
function serverApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mongoDBManager = inversify_config_1.container.get(utils_1.INTERFACE_TYPE.MongoDBManager);
            yield mongoDBManager.connect();
            const sessionRepository = inversify_config_1.container.get(utils_1.INTERFACE_TYPE.SessionRepository);
            const mongoDBStore = new mongodb_session_store_1.MongoDBStore(sessionRepository);
            const appServer = (0, app_1.runApp)(app, io, mongoDBManager, mongoDBStore);
            // Global middleware for all Socket.IO events
            io.use((socket, next) => {
                common_1.eventManager.setSharedContext({ io: socket, mongodb: mongoDBManager }, null, null);
                init.Init();
                (0, common_1.doAction)('init');
                // Call next() to proceed to the next middleware or event handler
                next();
            });
            server.listen(PORT);
            server.on('error', onError);
            server.on('listening', onListening);
        }
        catch (error) {
            console.error("Error occurred while starting the server:", error);
        }
    });
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
