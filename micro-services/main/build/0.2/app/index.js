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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runApp = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const node_sass_middleware_1 = __importDefault(require("node-sass-middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const common_1 = require("../common");
const routes_1 = require("./routes");
const express_session_1 = __importDefault(require("express-session"));
const init = __importStar(require("../common/event-init"));
const handle_response_1 = __importDefault(require("../common/middlewares/handle-response"));
const exphbs = __importStar(require("express-handlebars"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const serve_static_1 = __importDefault(require("serve-static"));
const middlewares_1 = require("../common/middlewares");
const runApp = (app, io, mongoDBManager, mongoDBStore) => {
    try {
    }
    catch (error) {
    }
    // Middleware to make io accessible to all routes
    app.use((req, res, next) => {
        console.log("init....");
        req.io = io;
        req.mongodb = mongoDBManager;
        common_1.eventManager.setSharedContext(req, res, null);
        init.Init();
        // Register a callback for the 'finish' event
        res.on('finish', () => {
            // This code will be executed after the response is sent
            (0, common_1.doAction)('shutdown');
        });
        next();
    });
    const hbs = exphbs.create({
        extname: '.hbs',
        helpers: {
            isObject(value) {
                return typeof value === 'object';
            },
            log(value) {
                console.log(value);
            },
            isArray(value) {
                return Array.isArray(value);
            }
        }
    });
    app.use(common_1.isMainRequest);
    app.use(handle_response_1.default);
    app.set("views", path_1.default.join(__dirname, "../../views"));
    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, express_session_1.default)({
        secret: process.env.SECRET_KEY || 'test',
        resave: false,
        saveUninitialized: true,
        store: mongoDBStore, // Use your custom store
    }));
    app.use((0, cookie_parser_1.default)());
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use((0, common_1.flash)());
    app.use(common_1.currentUser);
    app.use((0, node_sass_middleware_1.default)({
        src: path_1.default.join(__dirname, "../../public"),
        dest: path_1.default.join(__dirname, "../../public"),
        indentedSyntax: true, // true = .sass and false = .scss
        sourceMap: true,
    }));
    app.use((0, serve_favicon_1.default)(path_1.default.join(__dirname, '../../public', 'favicon.ico')));
    app.use((0, serve_static_1.default)(path_1.default.join(__dirname, "../../public"), {
        maxAge: '1d',
        setHeaders: middlewares_1.setCustomCacheControl,
        dotfiles: "deny"
    }));
    app.use("/", routes_1.main);
    app.use("/auth/", routes_1.mainRouters.auth);
    app.use("/account/", routes_1.mainRouters.account);
    app.use("/api/v1/", routes_1.api.v1);
    // This middleware will capture any request that doesn't match any route above
    app.use((req, res, next) => {
        const error = new common_1.NotFoundError;
        error.status = 404;
        next(error);
    });
    app.use(common_1.errorHandler);
    return app;
};
exports.runApp = runApp;
