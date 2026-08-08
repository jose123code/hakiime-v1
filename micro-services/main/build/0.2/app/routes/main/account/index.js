"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.account = void 0;
const express_1 = __importDefault(require("express"));
const Account_1 = require("./Account");
/**
 * Initializes version 1 (Account) of the API routes.
 * @returns {Router} The configured router for Account routes.
 */
exports.account = (() => {
    const router = express_1.default.Router();
    // Apply routes from Account module
    (0, Account_1.Account)(router);
    return router;
})();
