import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from "cors";
import passport from "passport";
import path from "path";
import logger from "morgan";
import sassMiddleware from "node-sass-middleware";
import cookieParser from "cookie-parser";
import { NotFoundError, currentUser, doAction, errorHandler, eventManager, flash, isMainRequest } from '../common';
import { api, main, mainRouters } from "./routes";
import session, { Store } from 'express-session';
import { MongoDBManager } from '../services/mongodb.manager';
import * as init from "../common/event-init";
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import handleResponse from '../common/middlewares/handle-response';
import * as exphbs from 'express-handlebars';
import { MongoDBStore } from '../services/mongodb.session.store';
import favicon from "serve-favicon";
import serveStatic from "serve-static";
import { setCustomCacheControl } from '../common/middlewares';

export const runApp = (app: any, io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, mongoDBManager: MongoDBManager, mongoDBStore: MongoDBStore) => {
try {
  
} catch (error) {
  
}
  // Middleware to make io accessible to all routes
  app.use((req: Request | any, res: Response, next: NextFunction) => {
    console.log("init....");

    req.io = io;
    req.mongodb = mongoDBManager;
    eventManager.setSharedContext(req, res, null);
    init.Init();

    // Register a callback for the 'finish' event
    res.on('finish', () => {
      // This code will be executed after the response is sent
      doAction('shutdown');
    });
    next();


  });
  const hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
      isObject(value: any) {
        return typeof value === 'object';
      },

      log(value: any) {
        console.log(value);

      },
      isArray(value: any) {
        return Array.isArray(value);
      }
    }
  });

  app.use(isMainRequest);
  app.use(handleResponse);
  app.set("views", path.join(__dirname, "../../views"));
  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');
  app.use(cors());
  app.use(logger("dev"));


  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(session({
    secret: process.env.SECRET_KEY || 'test',
    resave: false,
    saveUninitialized: true,
    store: mongoDBStore as unknown as Store, // Use your custom store
  }));
  app.use(cookieParser());


  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(currentUser);

  app.use(sassMiddleware({
    src: path.join(__dirname, "../../public"),
    dest: path.join(__dirname, "../../public"),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
  })
  );

  app.use(favicon(path.join(__dirname, '../../public', 'favicon.ico')))



  app.use(serveStatic(path.join(__dirname, "../../public"), {
    maxAge: '1d',
    setHeaders: setCustomCacheControl,
    dotfiles: "deny"
  }))

  app.use("/", main);
  app.use("/auth/", mainRouters.auth);
  app.use("/account/", mainRouters.account);

  app.use("/api/v1/", api.v1);

  // This middleware will capture any request that doesn't match any route above
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error: any = new NotFoundError;
    error.status = 404;
    next(error);
  });

  app.use(errorHandler);

  return app;
}

