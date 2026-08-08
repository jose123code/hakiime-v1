"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
class Session {
    constructor(idSession, session, expires) {
        this.idSession = idSession;
        this.session = session;
        this.expires = expires;
    }
}
exports.Session = Session;
