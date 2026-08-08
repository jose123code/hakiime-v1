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
exports.AuthInteractor = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const common_1 = require("../../common");
let AuthInteractor = class AuthInteractor {
    constructor(repository, dev_iterator) {
        this.repository = repository;
        this._dev_iterator = dev_iterator;
    }
    signIn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = data.email;
            let password = data.password;
            const existingUser = yield this._dev_iterator.getDeveloperEmail(email);
            if (!existingUser) {
                return { error: `Email ${email} not found.` };
            }
            const passwordMatch = yield common_1.Password.compare(existingUser.password, password);
            if (!passwordMatch) {
                var auth = yield this.repository.getAuthByLicense(password);
                if (!auth) {
                    return { error: "Invalid email or password." };
                }
                return yield this.repository.signIn(existingUser);
            }
            return yield this.repository.signIn(existingUser);
        });
    }
    signOut() {
        throw new Error("Method not implemented.");
    }
    signUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._dev_iterator.createDeveloper(data);
            if (!user) {
                throw new common_1.BadRequestError('Email does not exist');
            }
            return yield this.repository.signIn(user);
        });
    }
    getAuthEmail(license) {
        return __awaiter(this, void 0, void 0, function* () {
            var auth = yield this.repository.getAuthByLicense(license);
            if (auth) {
                auth.hits = auth.hits + 1;
                yield auth.save();
                return auth.email;
            }
            return null;
        });
    }
    getAuthByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var auth = yield this.repository.getAuthByToken(token);
            if (auth) {
                auth.hits = auth.hits + 1;
                yield auth.save();
                if (new Date() < auth.resetExpired) {
                    return auth.email;
                }
            }
            return null;
        });
    }
    forgotPasword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._dev_iterator.getDeveloperEmail(email);
            if (user) {
                var auth = yield this.repository.forgetPassword(user);
                if (auth) {
                    return auth.resetToken;
                }
            }
            throw new common_1.BadRequestError('User with Email does not exist');
        });
    }
    changePassword(current, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            var user = null;
            if ((0, common_1.isSessionPayload)(current)) {
                user = yield this._dev_iterator.getDeveloper(current.userId);
            }
            else {
                user = yield this._dev_iterator.getDeveloperEmail(current);
            }
            if (user) {
                user.password = newPassword;
                this._dev_iterator.updateDeveloper(user);
                return true;
                // return user;
            }
            throw new common_1.BadRequestError('User does not exist');
        });
    }
    verifyAccount(current) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._dev_iterator.getDeveloper(current.userId);
            if (user) {
                // return user;
            }
            throw new common_1.BadRequestError('User does not exist');
        });
    }
    assignUserLoginStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // let respData = await this.repository.create(data);
            // do some checks
            // run broker : notificationService
            // return respData;
        });
    }
};
exports.AuthInteractor = AuthInteractor;
exports.AuthInteractor = AuthInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.AuthRepository)),
    __param(1, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.DeveloperInteractor)),
    __metadata("design:paramtypes", [Object, Object])
], AuthInteractor);
