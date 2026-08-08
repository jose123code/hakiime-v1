"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const inversify_config_1 = require("../../../inversify.config");
const utils_1 = require("../../utils");
exports.default = () => {
    passport_1.default.serializeUser((user, done) => {
        done(null, user.current);
    });
    passport_1.default.deserializeUser((id, done) => {
        const controller = inversify_config_1.container.get(utils_1.INTERFACE_TYPE.AuthController);
        // knex('users').where({id}).first()
        // .then((user) => { done(null, user); })
        // .catch((err) => { done(err, null); });
    });
};
