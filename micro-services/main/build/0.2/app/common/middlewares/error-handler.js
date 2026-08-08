"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorHandler = exports.errorHandler = void 0;
const custom_error_1 = require("../errors/custom-error");
const customLogger = __importStar(require("../errors/logger"));
const express_validator_1 = require("express-validator");
const errorHandler = (err, req, res, next) => {
    if (err instanceof custom_error_1.CustomError) {
        customLogger.Logger.error(`API Error: ${JSON.stringify(err.serializeErrors(), null, 2)}`);
        return res.error({ errors: err.serializeErrors() }, err.statusCode, false);
    }
    customLogger.Logger.error(`API Error ${err.name}: ${err.message}\n\tStack: ${err.stack}`);
    res.error('Something went wrong', 400, false);
};
exports.errorHandler = errorHandler;
// Middleware function to handle validation errors
const validationErrorHandler = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        if (req.isMain) {
            req.flash("errors", errors.array());
            return res.redirect("/" + req.template);
        }
        return res.error(errors.array(), 400);
    }
    next(); // Proceed to the next middleware or route handler
};
exports.validationErrorHandler = validationErrorHandler;
