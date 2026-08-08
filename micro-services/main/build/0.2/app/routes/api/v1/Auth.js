"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const utils_1 = require("../../../../utils");
const express_validator_1 = require("express-validator");
const common_1 = require("../../../../common");
const inversify_config_1 = require("../../../../inversify.config");
const Auth = (router) => {
    const controller = inversify_config_1.container.get(utils_1.INTERFACE_TYPE.AuthController);
    router.post('/auth/register', [
        (0, express_validator_1.body)('developerName').trim().notEmpty().withMessage('Please Provide Developer name'),
        (0, express_validator_1.body)('developerEmail').isEmail().withMessage('Email must be valid'),
        (0, express_validator_1.body)('developerPhone').isMobilePhone("any").withMessage('Phone number is invalid'),
        (0, express_validator_1.body)('developerPassword').trim().notEmpty().withMessage('Password is required'),
    ], common_1.validationErrorHandler, controller.onCreateAuth.bind(controller));
    router.post('/auth', [
        (0, express_validator_1.body)('email').isEmail().withMessage('Email must be valid'),
        (0, express_validator_1.body)('password').trim().notEmpty().withMessage('Password is required'),
    ], common_1.validationErrorHandler, controller.onAuth.bind(controller));
    router.post('/authorization', [
        (0, express_validator_1.body)('email').isEmail().withMessage('Email must be valid'),
        (0, express_validator_1.body)('authorization').trim().notEmpty().withMessage('Authorization key is required'),
    ], common_1.validationErrorHandler, controller.onAuthorization.bind(controller));
    return router;
};
exports.Auth = Auth;
