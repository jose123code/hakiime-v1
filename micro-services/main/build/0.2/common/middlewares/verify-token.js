"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenVerify = exports.verify_token = void 0;
const jwt_1 = require("../jwt");
const not_authorized_error_1 = require("../errors/not-authorized-error");
/**
 * Middleware to extract and verify the JWT token from the request header or session.
 * Sets the currentUser property on the request object.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next middleware function.
 */
const verify_token = (req, res, next) => {
    // Extract token from the Authorization header or session
    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    // If token is not found in headers, check session
    if (!token && req.params.token) {
        token = req.params.token;
    }
    // If token is still not found, move to the next middleware
    if (!token) {
        throw new not_authorized_error_1.NotAuthorizedError();
    }
    // Verify the token and set currentUser on the request
    const payload = (0, jwt_1.verifyToken)(token);
    // Check if the payload is of the correct type and set currentUser accordingly
    if (isTokenVerify(payload)) {
        next();
    }
    else {
        throw new not_authorized_error_1.NotAuthorizedError();
    }
};
exports.verify_token = verify_token;
/**
 * Checks if the given payload is of type TokenVerify.
 * @param payload The payload to check.
 * @returns True if the payload is of type TokenVerify, false otherwise.
 */
function isTokenVerify(payload) {
    return typeof payload === 'object' && 'verify' in payload && 'data' in payload;
}
exports.isTokenVerify = isTokenVerify;
