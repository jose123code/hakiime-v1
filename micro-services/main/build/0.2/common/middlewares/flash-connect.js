"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flash = void 0;
function _flash(type, msg) {
    if (this.session === undefined)
        throw new Error('req.flash() requires sessions');
    const msgs = this.session.flash = this.session.flash || {};
    if (type && msg) {
        if (Array.isArray(msg)) {
            msg.forEach(val => {
                (msgs[type] = msgs[type] || []).push(val);
            });
            return msgs[type].length;
        }
        return (msgs[type] = msgs[type] || []).push(msg);
    }
    else if (type) {
        const arr = msgs[type];
        delete msgs[type];
        return arr || [];
    }
    else {
        this.session.flash = {};
        return msgs;
    }
}
function flash(options = {}) {
    const safe = options.unsafe === undefined ? true : !options.unsafe;
    return function (req, res, next) {
        if (req.flash && safe) {
            return next();
        }
        req.flash = _flash;
        next();
    };
}
exports.flash = flash;
