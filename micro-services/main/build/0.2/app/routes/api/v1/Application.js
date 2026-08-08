"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const utils_1 = require("../../../../utils");
const express_validator_1 = require("express-validator");
const common_1 = require("../../../../common");
const inversify_config_1 = require("../../../../inversify.config");
const Application = (router) => {
    const controller = inversify_config_1.container.get(utils_1.INTERFACE_TYPE.ApplicationController);
    router.post('/app', common_1.requireAuth, [
        (0, express_validator_1.body)('appName').trim().notEmpty().withMessage('Please provide application name'),
        (0, express_validator_1.body)('appURL').trim().isURL().withMessage('App Url must be valid'),
        (0, express_validator_1.body)('appCallback').trim().isURL().withMessage('Application Callback must be a valid url')
    ], common_1.validationErrorHandler, controller.onCreateApplication.bind(controller));
    router.get('/app/:apptoken', common_1.requireAuth, controller.onViewApplication.bind(controller));
    return router;
};
exports.Application = Application;
