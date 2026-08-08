"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const utils_1 = require("../../../../utils");
const common_1 = require("../../../../common");
const inversify_config_1 = require("../../../../inversify.config");
require("../../../../common/auth/local");
const Account = (router) => {
    const controller = inversify_config_1.container.get(utils_1.INTERFACE_TYPE.AccountController);
    router.get('/', common_1.isAuthenticated, controller.onAccount.bind(controller));
    return router;
};
exports.Account = Account;
