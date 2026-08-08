"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const express_1 = __importDefault(require("express"));
const Auth_1 = require("./Auth");
/**
 * Initializes version 1 (auth) of the API routes.
 * @returns {Router} The configured router for auth routes.
 */
exports.auth = (() => {
    const router = express_1.default.Router();
    // Apply routes from Auth module
    (0, Auth_1.Auth)(router);
    return router;
})();
