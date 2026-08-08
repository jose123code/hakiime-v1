"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSessionPayload = exports.isLicensePayload = exports.isUserPayload = exports.currentUser = void 0;
const jwt_1 = require("../jwt");
const verify_token_1 = require("./verify-token");
/**
 * Middleware to extract and verify the JWT token from the request header or session.
 * Sets the currentUser property on the request object.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next middleware function.
 */
const currentUser = (req, res, next) => {
    var _a;
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== "/auth/login" &&
        req.path !== "/auth/register" &&
        !req.path.match(/^\/auth1/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    }
    else if (req.user &&
        req.path == "/account") {
        req.session.returnTo = req.path;
    }
    // Extract token from the Authorization header or session
    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    // If token is not found in headers, check session
    if (!token && ((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt)) {
        token = req.session.jwt;
    }
    // If token is not found in headers, check session
    if (!token && req.params.token) {
        token = req.params.token;
    }
    // If token is still not found, move to the next middleware
    if (!token) {
        return next();
    }
    // Verify the token and set currentUser on the request
    const payload = (0, jwt_1.verifyToken)(token);
    // Check if the payload is of the correct type and set currentUser accordingly
    if (isUserPayload(payload) || isSessionPayload(payload) || isLicensePayload(payload)) {
        req.currentUser = payload;
    }
    // Check if the payload is of the correct type and set currentUser accordingly
    if ((0, verify_token_1.isTokenVerify)(payload)) {
        req.currentUser = payload.data;
    }
    if (token.startsWith('HKMIVYS-')) {
        req.currentUser = {
            auth: token
        };
    }
    next();
};
exports.currentUser = currentUser;
/**
 * Checks if the given payload is of type UserPayload.
 * @param payload The payload to check.
 * @returns True if the payload is of type UserPayload, false otherwise.
 */
function isUserPayload(payload) {
    return typeof payload === 'object' && 'id' in payload && 'email' in payload;
}
exports.isUserPayload = isUserPayload;
/**
 * Checks if the given payload is of type LicensePayload.
 * @param payload The payload to check.
 * @returns True if the payload is of type LicensePayload, false otherwise.
 */
function isLicensePayload(payload) {
    return typeof payload === 'object' && 'auth' in payload && payload.auth.startsWith("HKMIVYS-");
}
exports.isLicensePayload = isLicensePayload;
/**
 * Checks if the given payload is of type SessionPayload.
 * @param payload The payload to check.
 * @returns True if the payload is of type SessionPayload, false otherwise.
 */
function isSessionPayload(payload) {
    return typeof payload === 'object' && 'userId' in payload && 'expiresAt' in payload;
}
exports.isSessionPayload = isSessionPayload;
