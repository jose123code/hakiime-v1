"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init = void 0;
const events_1 = require("./events");
const Init = () => {
    (0, events_1.addAction)('init', () => {
        console.log('hello init!');
    }, 0, 0);
    (0, events_1.addAction)('shutdown', (context) => {
        if (context.req != null) {
            // context.req.mongodb.close();
        }
    }, 0, 0);
};
exports.Init = Init;
