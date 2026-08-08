"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const inversify_config_1 = require("../../inversify.config");
const utils_1 = require("../../utils");
const LocalStrategy = passport_local_1.default.Strategy;
passport_1.default.serializeUser((req, user, done) => {
    done(undefined, user.current.auth);
});
passport_1.default.deserializeUser((id, done) => {
    const controller = inversify_config_1.container.get(utils_1.INTERFACE_TYPE.AuthController);
    controller.onDeserializeAuth.bind(controller)(id, done).then(data => {
        return data;
    }).catch((err) => {
        return done(err);
    });
});
passport_1.default.use(new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    const controller = inversify_config_1.container.get(utils_1.INTERFACE_TYPE.AuthController);
    controller.onAuthPassport.bind(controller)(username, password, done).then(data => {
        return data;
    }).catch((err) => {
        return done(err);
    });
}));
