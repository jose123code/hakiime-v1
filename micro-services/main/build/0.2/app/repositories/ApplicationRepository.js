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
exports.ApplicationRepository = void 0;
const inversify_1 = require("inversify");
const mongodb_manager_1 = require("../../services/mongodb.manager");
const utils_1 = require("../../utils");
let ApplicationRepository = class ApplicationRepository {
    constructor(db) {
        this._db = db; // Assign the injected MongoDBManager to the class property
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this._collection = this._db.getCollection('Application');
            try {
                let url = data.url;
                let name = data.name;
                let callbackUrl = data.callback;
                let description = data.description;
                let token = data.token;
                // Get the application collection
                // Check if a application with the given URL already exists
                const existingApplication = yield this._collection.findOne({ url });
                if (existingApplication) {
                    // console.log('application already exists:', existingApplication._id);
                    return existingApplication;
                }
                // Create a new Application instance
                const newApplication = new this._collection({
                    name,
                    token,
                    url,
                    description,
                    callbackUrl
                });
                // Save the Application to the database
                const savedApplication = yield newApplication.save();
                return savedApplication;
            }
            catch (error) {
                console.error('Error inserting website:', error);
                return null;
            }
        });
    }
    update(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { name, url, description, callback, token }) {
            throw new Error("not yet implimented");
        });
    }
    findApplication(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this._collection = this._db.getCollection('Application');
            const app = yield this._collection.findById(id).exec();
            return app;
        });
    }
    findAppByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            this._collection = this._db.getCollection('Application');
            const app = yield this._collection.findOne({ token });
            return app;
        });
    }
};
exports.ApplicationRepository = ApplicationRepository;
exports.ApplicationRepository = ApplicationRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.MongoDBManager)),
    __metadata("design:paramtypes", [mongodb_manager_1.MongoDBManager])
], ApplicationRepository);
