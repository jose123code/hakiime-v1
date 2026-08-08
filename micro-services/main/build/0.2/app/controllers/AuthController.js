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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
require("../../common/auth/local");
const passport_1 = __importDefault(require("passport"));
const common_1 = require("../../common");
// Extend the Request interface to include currentUser property
let AuthController = class AuthController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    onCreateAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { developerName, developerEmail, developerPassword } = req.body;
                var developerPhone = 0;
                if ('developerPhone' in req.body) {
                    developerPhone = req.body.developerPhone;
                }
                const devInput = {
                    email: developerEmail,
                    name: developerName,
                    phone: developerPhone,
                    password: developerPassword
                };
                // validate logic
                const data = yield this.interactor.signUp(devInput);
                if (data == null) {
                    return res.error('Something went wrong', 400);
                }
                else {
                    if (req.isMain) {
                        req.logIn({ current: { auth: data.license } }, (err) => {
                            if (err) {
                                return next(err);
                            }
                            res.redirect("/");
                        });
                    }
                    return res.success(data);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    onAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const auth = {
                    email: email,
                    password: password
                };
                if (req.isMain) {
                    return passport_1.default.authenticate("local", (err, user, info) => {
                        if (err) {
                            return next(err);
                        }
                        if (!user) {
                            req.flash("errors", { msg: info.message });
                            return res.redirect("/" + req.template);
                        }
                        req.logIn({ current: user }, (err) => {
                            if (err) {
                                return next(err);
                            }
                            req.flash("success", { msg: "Success! You are logged in." });
                            var returnTo = "/";
                            if (req.session.returnTo !== undefined)
                                returnTo = req.session.returnTo;
                            console.log("return to " + returnTo + ".....");
                            return res.redirect(returnTo);
                        });
                    })(req, res, next);
                }
                // validate logic
                const data = yield this.interactor.signIn(auth);
                if (data == null) {
                    return res.error('Something went wrong', 400);
                }
                else {
                    if ('error' in data) {
                        throw new common_1.BadRequestError(data.error);
                    }
                    return res.success(data);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    onAuthPassport(email, password, done) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = {
                email: email,
                password: password
            };
            // validate logic
            const data = yield this.interactor.signIn(auth);
            if (data == null) {
                return done(undefined, false, { message: `Invalid email or password.` });
            }
            else {
                if ('error' in data) {
                    return done(undefined, false, { message: data.error });
                }
                return done(undefined, { auth: data.license });
            }
        });
    }
    onDeserializeAuth(license, done) {
        return __awaiter(this, void 0, void 0, function* () {
            // validate logic
            const data = yield this.interactor.getAuthEmail(license);
            if (data == null) {
                throw new common_1.BadRequestError('Invalid session.' + license);
            }
            else {
                return done(undefined, { auth: license });
            }
        });
    }
    onAuthorization(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, authorization } = req.body;
                const auth = {
                    email: email,
                    password: authorization
                };
                // validate logic
                const data = yield this.interactor.signIn(auth);
                if (data == null) {
                    return res.error('Something went wrong', 400);
                }
                else {
                    if ('error' in data) {
                        return res.error(data.error, 200);
                    }
                    return res.success(data);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    onAuthForgot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                // validate logic
                const data = yield this.interactor.forgotPasword(email);
                if (data == null) {
                    return res.error('Something went wrong', 400);
                }
                else {
                    req.flash("info", { msg: `An e-mail has been sent to ${email} with further instructions.` });
                    return res.redirect("/" + req.template);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    onVerifyAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var currentUser = req.currentUser;
                // validate logic
                const data = yield this.interactor.verifyAccount(currentUser);
                return res.status(200).json(data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    onResetPasswordGet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.isAuthenticated()) {
                return res.redirect("/");
            }
            var token = req.params.token;
            var emailDev = yield this.interactor.getAuthByToken(token);
            if (emailDev) {
                req.template = "auth/reset-password";
                return res.template({ token });
            }
            req.flash('errors', [{ msg: "Password reset token is invalid or has expired." }]);
            return res.redirect("/auth/login");
        });
    }
    onResetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { newPassword } = req.body;
                var token = req.params.token;
                var emailDev = yield this.interactor.getAuthByToken(token);
                if (emailDev) {
                    // validate logic
                    const data = yield this.interactor.changePassword(emailDev, newPassword);
                    if (data) {
                        return res.redirect("/auth/login");
                    }
                }
                req.flash('errors', [{ msg: "Password reset token is invalid or has expired." }]);
                res.redirect("/" + req.template);
            }
            catch (error) {
                req.flash('errors', [{ msg: "Password reset token is invalid or has expired." }]);
                res.redirect("/" + req.template);
            }
        });
    }
    VerifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //   // validate logic
            //   const data = await this.interactor.verifyAccount(currentUser);
            //   return res.status(200).json(data);
            // } catch (error) {
            //   next(error);
            // }
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.AuthInteractor)),
    __metadata("design:paramtypes", [Object])
], AuthController);
