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
exports.DeveloperRepository = void 0;
const inversify_1 = require("inversify");
const mongodb_manager_1 = require("../../services/mongodb.manager");
const utils_1 = require("../../utils");
let DeveloperRepository = class DeveloperRepository {
    constructor(db) {
        this._db = db; // Assign the injected MongoDBManager to the class property
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this._collection = this._db.getCollection('Developer');
            try {
                let email = data.email;
                let name = data.name;
                let phone = data.phone;
                let password = data.password;
                // Get the Developer collection
                // Check if a Developer with the given URL already exists
                const existingDeveloperEmail = yield this._collection.findOne({ email });
                const existingDeveloperPhone = yield this._collection.findOne({ phone });
                if (existingDeveloperEmail) {
                    console.log('Developer already exists with this email:', existingDeveloperEmail._id);
                    return existingDeveloperEmail;
                }
                if (existingDeveloperPhone) {
                    console.log('Developer already exists with this phone number:', existingDeveloperPhone._id);
                    return existingDeveloperPhone;
                }
                // Create a new Developer instance
                const newDeveloper = new this._collection({
                    name,
                    email,
                    phone,
                    password
                });
                // Save the Developer to the database
                const savedDeveloper = yield newDeveloper.save();
                return savedDeveloper;
            }
            catch (error) {
                console.error('Error inserting website:', error);
                return null;
            }
        });
    }
    update(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            yield doc.save();
        });
    }
    updateApplication(id, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._collection = this._db.getCollection('Developer');
            // Find the developer by ID and update their applications array
            yield this._collection.findByIdAndUpdate(id, { $push: { applications: applicationId } });
        });
    }
    find(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("not yet implimented");
        });
    }
    findDeveloper(developerId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._collection = this._db.getCollection('Developer');
            const developer = yield this._collection.findById(developerId).exec();
            return developer;
        });
    }
    findDeveloperEmail(developerEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            var email = developerEmail;
            this._collection = this._db.getCollection('Developer');
            const developer = yield this._collection.findOne({ email });
            return developer;
        });
    }
    findDeveloperPhone(developerPhone) {
        return __awaiter(this, void 0, void 0, function* () {
            var phone = developerPhone;
            this._collection = this._db.getCollection('Developer');
            const developer = yield this._collection.findOne({ phone });
            return developer;
        });
    }
};
exports.DeveloperRepository = DeveloperRepository;
exports.DeveloperRepository = DeveloperRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.MongoDBManager)),
    __metadata("design:paramtypes", [mongodb_manager_1.MongoDBManager])
], DeveloperRepository);
