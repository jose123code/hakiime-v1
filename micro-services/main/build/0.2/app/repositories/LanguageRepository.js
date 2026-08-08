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
exports.LanguageRepository = void 0;
const inversify_1 = require("inversify");
const mongodb_manager_1 = require("../../services/mongodb.manager");
const utils_1 = require("../../utils");
let LanguageRepository = class LanguageRepository {
    constructor(db) {
        this._db = db; // Assign the injected MongoDBManager to the class property
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this._collection = this._db.getCollection('Language');
            try {
                let abbr = data.abbr;
                let name = data.name;
                // Get the Language collection
                // Check if a Language with the given URL already exists
                const existingLanguage = yield this._collection.findOne({ name });
                if (existingLanguage) {
                    console.log('Language already exists:', existingLanguage);
                    return existingLanguage;
                }
                // Create a new Language instance
                const newLanguage = new this._collection({
                    name,
                    abbr
                });
                // Save the Language to the database
                const savedLanguage = yield newLanguage.save();
                return savedLanguage;
            }
            catch (error) {
                console.error('Error inserting website:', error);
                return null;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("not yet implimented");
        });
    }
    find(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("not yet implimented");
        });
    }
};
exports.LanguageRepository = LanguageRepository;
exports.LanguageRepository = LanguageRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.MongoDBManager)),
    __metadata("design:paramtypes", [mongodb_manager_1.MongoDBManager])
], LanguageRepository);
