"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthCall = exports.isApiCall = exports.isMainRequest = void 0;
const isMainRequest = (req, res, next) => {
    if (!isApiCall(req.originalUrl)) {
        req.isMain = true;
        req.template = req.originalUrl.replace(/^\/+|\/+$/g, '');
        if (isAuthCall(req.originalUrl)) {
            req.layout = "authLayout";
        }
        else {
            req.layout = "layout";
        }
    }
    next();
};
exports.isMainRequest = isMainRequest;
function isApiCall(str) {
    const trimmedStr = str.replace(/^\/+|\/+$/g, ''); // Trim leading and trailing slashes
    return trimmedStr.startsWith("api") || trimmedStr.startsWith("ajax");
}
exports.isApiCall = isApiCall;
function isAuthCall(str) {
    const trimmedStr = str.replace(/^\/+|\/+$/g, ''); // Trim leading and trailing slashes
    return trimmedStr.startsWith("auth");
}
exports.isAuthCall = isAuthCall;
