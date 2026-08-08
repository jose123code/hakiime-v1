"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationInteractor = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const common_1 = require("../../common");
let ApplicationInteractor = class ApplicationInteractor {
    constructor(repository, dev_iterator, auth_interactor) {
        this.repository = repository;
        this._dev_iterator = dev_iterator;
        this._auth_iterator = auth_interactor;
    }
    createApplication(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let respData = yield this.repository.create(data);
            // do some checks
            // run broker : notificationService
            return respData;
        });
    }
    // to check if the application is already assigned to the developer
    isApplicationAssignedToDeveloper(developerId, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let developer = yield this._dev_iterator.getDeveloper(developerId);
            return (_a = developer === null || developer === void 0 ? void 0 : developer.applications.includes(applicationId)) !== null && _a !== void 0 ? _a : false;
        });
    }
    // Function to assign an application to a developer
    assignApplicationToDeveloper(developerId, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the application is already assigned to the developer
                const isAssigned = yield this.isApplicationAssignedToDeveloper(developerId, applicationId);
                if (isAssigned) {
                    // console.log('Application is already assigned to the developer');
                    return;
                }
                // Find the developer by ID and update their applications array
                yield this._dev_iterator.updateApplication(developerId, applicationId);
                // console.log('Application assigned to developer successfully');
            }
            catch (error) {
                console.error('Error assigning application to developer:', error);
            }
        });
    }
    getDevEmail(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var email = null;
            if ((0, common_1.isUserPayload)(currentUser)) {
                email = currentUser.email;
            }
            if ((0, common_1.isSessionPayload)(currentUser)) {
                email = currentUser.email;
            }
            if ((0, common_1.isLicensePayload)(currentUser)) {
                var license = currentUser.auth;
                var authEmail = yield this._auth_iterator.getAuthEmail(license);
                if (authEmail) {
                    email = authEmail;
                }
            }
            return email;
        });
    }
    // Usage example:
    insertDeveloperAndAssignApplication(app, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var email = yield this.getDevEmail(currentUser);
            if (email) {
                const dev = yield this._dev_iterator.getDeveloperEmail(email);
                if (dev) {
                    const newApplication = yield this.createApplication(app);
                    if (newApplication) {
                        yield this.assignApplicationToDeveloper(dev._id, newApplication._id);
                        return newApplication;
                    }
                }
            }
            return null;
        });
    }
    getApp(token, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var email = yield this.getDevEmail(currentUser);
            if (email) {
                const dev = yield this._dev_iterator.getDeveloperEmail(email);
                if (dev) {
                    const application = yield this.repository.findAppByToken(token);
                    if (application) {
                        return application;
                    }
                }
            }
            return null;
        });
    }
    update(id, data) {
        throw new Error("Method not implemented.");
    }
    checkToken(name) {
        throw new Error("Method not implemented.");
    }
    getApplications(limit, offset) {
        throw new Error("Method not implemented.");
    }
};
exports.ApplicationInteractor = ApplicationInteractor;
exports.ApplicationInteractor = ApplicationInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.ApplicationRepository)),
    __param(1, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.DeveloperInteractor)),
    __param(2, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.AuthInteractor)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ApplicationInteractor);
