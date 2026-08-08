"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Middleware function to handle API responses.
 * This middleware enhances the response object with utility functions
 * for sending standardized success and error responses.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the chain.
 */
function handleResponse(req, res, next) {
    /**
     * Sends a success response with the provided data.
     * @param data - The data to be sent in the response.
     * @param metadata - Additional metadata to include in the response.
     */
    res.success = function (data, metadata) {
        const response = {
            success: true,
            data: data,
            metadata: metadata
        };
        if (req.isMain) {
            return res.render(req.template, { title: 'HKMCODE - Services', siteData: {
                    name: 'HKMService',
                    framwork: "HKMCode"
                }, layout: req.layout, success: true, data: data, metadata: metadata });
        }
        res.status(200).json(response);
    };
    res.template = function (data, metadata) {
        const response = {
            success: true,
            data: data,
            metadata: metadata
        };
        if (req.isMain) {
            var errors = req.flash('errors');
            var success = true;
            var error = null;
            if (errors) {
                error = errors;
                success = false;
            }
            return res.render(req.template, { title: 'HKMCODE - Services', siteData: {
                    name: 'HKMService',
                    framework: "HKMCode"
                }, layout: req.layout, success, error, data: data, metadata: metadata });
        }
        res.status(200).json(response);
    };
    /**
     * Sends an error response with the provided message and status code.
     * @param message - The error message to be sent in the response.
     * @param statusCode - The HTTP status code for the error response.
     */
    res.error = function (message, statusCode = 500, render = true) {
        const response = {
            success: false,
            error: {
                message: message
            }
        };
        if (render && req.isMain) {
            return res.render(req.template, { title: 'HKMCODE - Services', siteData: {
                    name: 'HKMService',
                    framework: "HKMCode"
                }, layout: req.layout, success: false, error: message });
        }
        res.status(statusCode).json(response);
    };
    next(); // Call the next middleware in the chain
}
exports.default = handleResponse;
