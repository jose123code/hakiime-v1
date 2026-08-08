"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const utils_1 = require("../../../../utils");
const express_validator_1 = require("express-validator");
const common_1 = require("../../../../common");
const inversify_config_1 = require("../../../../inversify.config");
const Auth = (router) => {
    const controller = inversify_config_1.container.get(utils_1.INTERFACE_TYPE.AuthController);
    router.post('/register', [
        (0, express_validator_1.body)('developerName')
            .trim()
            .notEmpty()
            .withMessage('Please Provide Developer name'),
        (0, express_validator_1.body)('developerEmail').isEmail().withMessage('Email must be valid'),
        (0, express_validator_1.body)('developerPassword')
            .trim()
            .notEmpty()
            .withMessage('Password is required'),
    ], common_1.validationErrorHandler, controller.onCreateAuth.bind(controller));
    router.get('/register', function (req, res, next) {
        res.template(null);
    });
    router.post('/login', [
        (0, express_validator_1.body)('email').isEmail().withMessage('Email must be valid'),
        (0, express_validator_1.body)('password').trim().notEmpty().withMessage('Password is required'),
    ], common_1.validationErrorHandler, controller.onAuth.bind(controller));
    router.get('/login', function (req, res, next) {
        res.template(null);
    });
    router.get('/logout', function (req, res, next) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });
    router.post('/authorization', [
        (0, express_validator_1.body)('email').isEmail().withMessage('Email must be valid'),
        (0, express_validator_1.body)('authorization')
            .trim()
            .notEmpty()
            .withMessage('Authorization key is required'),
    ], common_1.validationErrorHandler, controller.onAuthorization.bind(controller));
    router.post('/forgot-password', [(0, express_validator_1.body)('email').trim().notEmpty().isEmail().withMessage('Email must be valid')], common_1.validationErrorHandler, controller.onAuthForgot.bind(controller));
    router.get('/forgot-password', function (req, res, next) {
        res.template(null);
    });
    router.post('/reset/:token', [
        (0, express_validator_1.body)('newPassword').trim().notEmpty().isLength({ min: 4 }).withMessage('Password must be at least 4 characters long.'),
        (0, express_validator_1.body)('confirmPassword').trim().notEmpty().custom((value, { req }) => {
            return value === req.body.newPassword;
        }).withMessage('Passwords must match.')
    ], common_1.validationErrorHandler, controller.onResetPassword.bind(controller));
    router.get('/reset/:token', controller.onResetPasswordGet.bind(controller));
    return router;
};
exports.Auth = Auth;
