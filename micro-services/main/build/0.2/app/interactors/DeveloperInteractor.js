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
exports.DeveloperInteractor = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const common_1 = require("../../common");
/**
 * Interactor responsible for handling developer-related business logic.
 */
let DeveloperInteractor = class DeveloperInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Creates a new developer if the provided phone and email are unique.
     * @param data Developer data.
     * @returns Newly created developer.
     * @throws BadRequestError if email or phone already exist.
     */
    createDeveloper(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isPhoneUnique(data.phone)) {
                if (yield this.isEmailUnique(data.email)) {
                    const respData = yield this.repository.create(data);
                    // Additional logic can be added here
                    return respData;
                }
                else {
                    throw new common_1.BadRequestError('User with this email already exists!');
                }
            }
            else {
                throw new common_1.BadRequestError('User with this phone number already exists!');
            }
        });
    }
    updateDeveloper(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update(doc);
        });
    }
    /**
     * Checks if the provided phone number is unique.
     * @param phone Phone number to check.
     * @returns True if phone number is unique, otherwise false.
     */
    isPhoneUnique(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const dev = yield this.getDeveloperPhone(phone);
            return !dev;
        });
    }
    /**
     * Checks if the provided email is unique.
     * @param email Email to check.
     * @returns True if email is unique, otherwise false.
     */
    isEmailUnique(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const dev = yield this.getDeveloperEmail(email);
            return !dev;
        });
    }
    /**
     * Retrieves a developer by their ID.
     * @param developerId ID of the developer.
     * @returns Developer if found, otherwise null.
     */
    getDeveloper(developerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findDeveloper(developerId);
        });
    }
    /**
     * Retrieves a developer by their email.
     * @param developerEmail Email of the developer.
     * @returns Developer if found, otherwise null.
     */
    getDeveloperEmail(developerEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findDeveloperEmail(developerEmail);
        });
    }
    /**
     * Retrieves a developer by their phone number.
     * @param developerPhone Phone number of the developer.
     * @returns Developer if found, otherwise null.
     */
    getDeveloperPhone(developerPhone) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findDeveloperPhone(developerPhone);
        });
    }
    /**
     * Updates the applications of a developer.
     * @param id ID of the developer.
     * @param applicationId ID of the application to update.
     */
    updateApplication(id, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.updateApplication(id, applicationId);
        });
    }
    update(id, data) {
        throw new Error("Method not implemented.");
    }
    checkToken(name) {
        throw new Error("Method not implemented.");
    }
    getDevelopers(limit, offset) {
        throw new Error("Method not implemented.");
    }
};
exports.DeveloperInteractor = DeveloperInteractor;
exports.DeveloperInteractor = DeveloperInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.DeveloperRepository)),
    __metadata("design:paramtypes", [Object])
], DeveloperInteractor);
