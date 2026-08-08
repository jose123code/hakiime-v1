"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
class Application {
    constructor(name, url, callback, description, token) {
        this.name = name;
        this.url = url;
        this.callback = callback;
        this.description = description;
        this.token = token;
    }
}
exports.Application = Application;
