"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const ApplicationController_1 = require("./app/controllers/ApplicationController");
const AuthController_1 = require("./app/controllers/AuthController");
const ApplicationInteractor_1 = require("./app/interactors/ApplicationInteractor");
const ApplicationRepository_1 = require("./app/repositories/ApplicationRepository");
const utils_1 = require("./utils");
const mongodb_manager_1 = require("./services/mongodb.manager");
const DeveloperInteractor_1 = require("./app/interactors/DeveloperInteractor");
const DeveloperRepository_1 = require("./app/repositories/DeveloperRepository");
const LanguageInteractor_1 = require("./app/interactors/LanguageInteractor");
const LanguageRepository_1 = require("./app/repositories/LanguageRepository");
const AuthRepository_1 = require("./app/repositories/AuthRepository");
const AuthInteractor_1 = require("./app/interactors/AuthInteractor");
const flutterwave_manager_1 = require("./services/flutterwave.manager");
const config_1 = require("./app/config");
const SessionRepository_1 = require("./app/repositories/SessionRepository");
const AccountController_1 = require("./app/controllers/AccountController");
const factory_1 = require("./factory");
const container = new inversify_1.Container();
exports.container = container;
container
    .bind(utils_1.INTERFACE_TYPE.ApplicationRepository)
    .to(ApplicationRepository_1.ApplicationRepository);
container
    .bind(utils_1.INTERFACE_TYPE.ApplicationInteractor)
    .to(ApplicationInteractor_1.ApplicationInteractor);
container
    .bind(utils_1.INTERFACE_TYPE.AuthRepository)
    .to(AuthRepository_1.AuthRepository);
container
    .bind(utils_1.INTERFACE_TYPE.AuthInteractor)
    .to(AuthInteractor_1.AuthInteractor);
container.bind(utils_1.INTERFACE_TYPE.DeveloperInteractor)
    .to(DeveloperInteractor_1.DeveloperInteractor);
container.bind(utils_1.INTERFACE_TYPE.DeveloperRepository)
    .to(DeveloperRepository_1.DeveloperRepository);
container.bind(utils_1.INTERFACE_TYPE.SessionRepository)
    .to(SessionRepository_1.SessionRepository);
container.bind(utils_1.INTERFACE_TYPE.LanguageInteractor)
    .to(LanguageInteractor_1.LanguageInteractor);
container.bind(utils_1.INTERFACE_TYPE.LanguageRepository)
    .to(LanguageRepository_1.LanguageRepository);
container.bind(utils_1.INTERFACE_TYPE.ApplicationController).to(ApplicationController_1.ApplicationController);
container.bind(utils_1.INTERFACE_TYPE.AuthController).to(AuthController_1.AuthController);
container.bind(utils_1.INTERFACE_TYPE.AccountController).to(AccountController_1.AccountController);
container.bind(utils_1.INTERFACE_TYPE.MongoDBManager).to(mongodb_manager_1.MongoDBManager);
container.bind(utils_1.INTERFACE_TYPE.Flutterwave).to(flutterwave_manager_1.Flutterwave);
container.bind(utils_1.INTERFACE_TYPE.ConfigurationManager).to(config_1.ConfigurationManager);
container.bind(utils_1.INTERFACE_TYPE.RabbitMqSingletonConnectionFactory).to(factory_1.RabbitMqSingletonConnectionFactory);
container.bind(utils_1.INTERFACE_TYPE.RabbitMqConnectionFactory).to(factory_1.RabbitMqConnectionFactory);
