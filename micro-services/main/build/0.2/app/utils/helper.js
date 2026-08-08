"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDefaultValue = exports.emptyCheck = exports.getHeader = exports.socketInfo = exports.generateUniqueToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
function generateUniqueToken(length) {
    const timestamp = Date.now().toString(16); // Get current timestamp in hexadecimal format
    const randomBytes = crypto_1.default.randomBytes(Math.ceil(length / 2)).toString('hex'); // Generate random bytes
    // Concatenate timestamp and random bytes
    let token = timestamp + randomBytes;
    // Trim the token to the specified length
    token = token.slice(0, length);
    return token;
}
exports.generateUniqueToken = generateUniqueToken;
// get request info for socket
// adapted from express
const socketInfo = function (socket) {
    var headers = socket.request.headers || {};
    var o = {
        headers: headers,
        user: socket.user || null,
        address: null
    };
    var ip = getHeader('X-Forwarded-For', headers);
    ip = ip ? ip.split(/ *, */) : [];
    var conn = socket.request.connection;
    o.address = ip[0] ||
        conn.remoteAddress ||
        conn.localAddress ||
        null;
    return o;
};
exports.socketInfo = socketInfo;
// get http header from headers
// taken from express
function getHeader(name, headers) {
    switch (name = name.toLowerCase()) {
        case 'referer':
        case 'referrer':
            return headers.referrer || headers.referer;
        default:
            return headers[name];
    }
}
exports.getHeader = getHeader;
const emptyCheck = function (value, message, error) {
    message = message || 'Some error occured';
    error = error || Error;
    if (!value || typeof value == 'undefined')
        throw new error(message);
    return true;
};
exports.emptyCheck = emptyCheck;
const initDefaultValue = function (value, default_value) {
    if (value && typeof value !== null && typeof value == 'undefined') {
        return value;
    }
    return value || default_value;
};
exports.initDefaultValue = initDefaultValue;
