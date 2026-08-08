import { Container } from "inversify";
import { ApplicationController } from "./app/controllers/ApplicationController";
import { AuthController } from "./app/controllers/AuthController";
import { ApplicationInteractor } from "./app/interactors/ApplicationInteractor";
import { 
    IApplicationInteractor,
    IApplicationRepository,
    IDeveloperInteractor,
    IDeveloperRepository,
    ILanguageInteractor,
    ILanguageRepository,
    ISessionRepository,
    IAuthRepository,
    IConfig,
    IAuthInteractor
 } from "./interfaces";
import { ApplicationRepository } from "./app/repositories/ApplicationRepository";
import { INTERFACE_TYPE } from "./utils";
import { MongoDBManager } from "./services/mongodb.manager";
import { DeveloperInteractor } from "./app/interactors/DeveloperInteractor";
import { DeveloperRepository } from "./app/repositories/DeveloperRepository";
import { LanguageInteractor } from "./app/interactors/LanguageInteractor";
import { LanguageRepository } from "./app/repositories/LanguageRepository";
import { AuthRepository } from "./app/repositories/AuthRepository";
import { AuthInteractor } from "./app/interactors/AuthInteractor";
import { Flutterwave } from "./services/flutterwave.manager";
import { IFlutterwave } from "./interfaces/IFlutterwave";
import { ConfigurationManager } from "./app/config";
import { SessionRepository } from "./app/repositories/SessionRepository";
import { AccountController } from "./app/controllers/AccountController";
import { RabbitMqConnectionFactory, RabbitMqSingletonConnectionFactory } from "./factory";


const container = new Container(); 

container
    .bind<IApplicationRepository>(INTERFACE_TYPE.ApplicationRepository)
    .to(ApplicationRepository);

container
    .bind<IApplicationInteractor>(INTERFACE_TYPE.ApplicationInteractor)
    .to(ApplicationInteractor);

container
    .bind<IAuthRepository>(INTERFACE_TYPE.AuthRepository)
    .to(AuthRepository);

container
    .bind<IAuthInteractor>(INTERFACE_TYPE.AuthInteractor)
    .to(AuthInteractor);

container.bind<IDeveloperInteractor>(INTERFACE_TYPE.DeveloperInteractor)
         .to(DeveloperInteractor);

container.bind<IDeveloperRepository>(INTERFACE_TYPE.DeveloperRepository)
         .to(DeveloperRepository);


container.bind<ISessionRepository>(INTERFACE_TYPE.SessionRepository)
         .to(SessionRepository);
container.bind<ILanguageInteractor>(INTERFACE_TYPE.LanguageInteractor)
         .to(LanguageInteractor);

container.bind<ILanguageRepository>(INTERFACE_TYPE.LanguageRepository)
         .to(LanguageRepository);

container.bind<ApplicationController>(INTERFACE_TYPE.ApplicationController).to(ApplicationController);

container.bind<AuthController>(INTERFACE_TYPE.AuthController).to(AuthController);
container.bind<AccountController>(INTERFACE_TYPE.AccountController).to(AccountController);

container.bind<MongoDBManager>(INTERFACE_TYPE.MongoDBManager).to(MongoDBManager);

container.bind<IFlutterwave>(INTERFACE_TYPE.Flutterwave).to(Flutterwave);
container.bind<IConfig>(INTERFACE_TYPE.ConfigurationManager).to(ConfigurationManager);
container.bind<RabbitMqSingletonConnectionFactory>(INTERFACE_TYPE.RabbitMqSingletonConnectionFactory).to(RabbitMqSingletonConnectionFactory);
container.bind<RabbitMqConnectionFactory>(INTERFACE_TYPE.RabbitMqConnectionFactory).to(RabbitMqConnectionFactory);

export { container };