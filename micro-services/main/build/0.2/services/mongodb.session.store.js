"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBStore = void 0;
const events_1 = require("events");
const express_session_1 = require("express-session");
const OptionsData_1 = require("./OptionsData");
class MongoDBStore extends express_session_1.Store {
    constructor(sessionRepository) {
        super();
        this.options = OptionsData_1.defaultOptions;
        this.repo = sessionRepository;
        this._emitter = new events_1.EventEmitter();
        this._errorHandler = this.handleError.bind(this);
    }
    setOption(options) {
        this.options = OptionsData_1.defaultOptions.modify(options);
        return this;
    }
    get(sid, callback) {
        const _this = this;
        this.repo
            .getById(sid)
            .then((session) => {
            if (session) {
                if (!session.expires || new Date() < session.expires) {
                    return process.nextTick(() => callback(null, session.session));
                }
                else {
                    return _this.destroy(sid, callback);
                }
            }
            else {
                return process.nextTick(() => callback(null, null));
            }
        })
            .catch((error) => {
            const e = new Error('Error finding ' + sid + ': ' + error.message);
            return _this._errorHandler(e, callback);
        });
    }
    set(sid, session, callback) {
        const _this = this;
        var expires = new Date();
        if (session && session.cookie && session.cookie.expires) {
            expires = new Date(session.cookie.expires);
        }
        else {
            expires = new Date(expires.getTime() + this.options.expires);
        }
        const sessionDoc = { idSession: sid, session, expires };
        this.repo
            .update(sid, sessionDoc)
            .then(() => {
            _this.emit('set', sid);
            process.nextTick(() => callback && callback());
        })
            .catch((error) => {
            const e = new Error('Error setting ' +
                sid +
                ' to ' +
                require('util').inspect(session) +
                ': ' +
                error.message);
            return _this._errorHandler(e, callback);
        });
    }
    destroy(sid, callback) {
        const _this = this;
        this.repo
            .delete(sid)
            .then(() => {
            _this.emit('destroy', sid);
            process.nextTick(() => callback && callback());
        })
            .catch((error) => {
            const e = new Error('Error destroying ' + sid + ': ' + error.message);
            return _this._errorHandler(e, callback);
        });
    }
    touch(sid, session, callback) {
        const _this = this;
        var expires = new Date();
        if (session && session.cookie && session.cookie.expires) {
            expires = new Date(session.cookie.expires);
        }
        else {
            expires = new Date(expires.getTime() + this.options.expires);
        }
        const sessionDoc = { idSession: sid, session, expires };
        this.repo
            .update(sid, sessionDoc)
            .then(() => {
            _this.emit('touch', sid, session);
            process.nextTick(() => callback && callback());
        })
            .catch((error) => {
            const e = new Error('Error setting ' +
                sid +
                ' to ' +
                require('util').inspect(session) +
                ': ' +
                error.message);
            return _this._errorHandler(e, callback);
        });
    }
    handleError(error, callback) {
        if (this._emitter.listeners('error').length) {
            this.emit('error', error);
        }
        if (callback) {
            callback(error);
        }
        if (!this._emitter.listeners('error').length && !callback) {
            throw error;
        }
    }
}
exports.MongoDBStore = MongoDBStore;
