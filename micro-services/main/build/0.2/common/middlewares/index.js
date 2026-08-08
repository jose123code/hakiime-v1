"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HkmCodepowerdBy = exports.shouldCompress = exports.setCustomCacheControl = void 0;
const serve_static_1 = __importDefault(require("serve-static"));
const compression_1 = __importDefault(require("compression"));
function setCustomCacheControl(res, path) {
    if (serve_static_1.default.mime.lookup(path) === 'text/html') {
        // Custom Cache-Control for HTML files
        res.setHeader('Cache-Control', 'public, max-age=0');
    }
}
exports.setCustomCacheControl = setCustomCacheControl;
function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
    }
    // fallback to standard filter function
    return compression_1.default.filter(req, res);
}
exports.shouldCompress = shouldCompress;
const HkmCodepowerdBy = (req, res, next) => {
    res.setHeader('X-Powered-By', 'hkmcode');
    next();
};
exports.HkmCodepowerdBy = HkmCodepowerdBy;
