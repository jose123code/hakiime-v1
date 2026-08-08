"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1 = void 0;
const express_1 = __importDefault(require("express"));
const Application_1 = require("./Application");
const Auth_1 = require("./Auth");
const Test_1 = require("./Test");
/**
 * Initializes version 1 (v1) of the API routes.
 * @returns {Router} The configured router for v1 routes.
 */
exports.v1 = (() => {
    const router = express_1.default.Router();
    // Apply routes from Application module
    (0, Application_1.Application)(router);
    // Apply routes from Auth module
    (0, Auth_1.Auth)(router);
    (0, Test_1.Test)(router);
    return router;
})();
