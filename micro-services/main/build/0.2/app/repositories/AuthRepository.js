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
exports.AuthRepository = void 0;
const inversify_1 = require("inversify");
const mongodb_manager_1 = require("../../services/mongodb.manager");
const utils_1 = require("../../utils");
const jwt_1 = require("../../common/jwt");
const node_forge_1 = __importDefault(require("node-forge"));
const security_1 = __importDefault(require("../../common/security"));
let AuthRepository = class AuthRepository {
    constructor(db) {
        this._db = db; // Assign the injected MongoDBManager to the class property
    }
    authentication(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            this._collection = this._db.getCollection('Auth');
            try {
                let email = auth.email;
                // Get the Developer collection
                // Check if a Developer with the given URL already exists
                const existingAuth = yield this._collection.findOne({ email });
                if (existingAuth) {
                    existingAuth.hits = existingAuth.hits + 1;
                    existingAuth.save();
                    return { secreteKey: existingAuth.secreteKey, license: existingAuth.license };
                }
                // Generate a Triple-DES key with a size of 192 bits (32 bytes)
                const key = node_forge_1.default.random.getBytesSync(32);
                const iv = node_forge_1.default.random.getBytesSync(16);
                // Convert the key to Base64 string for storage/transmission
                const secreteKey = 'HKMSECK-' + security_1.default.cleanKey(node_forge_1.default.util.encode64(key));
                const license = 'HKMIVYS-' + security_1.default.cleanKey(node_forge_1.default.util.encode64(iv));
                // Generate asymmetric key pair
                security_1.default.generateAndSaveKeyPair(secreteKey);
                // Create a new Developer instance
                const newAuth = new this._collection({
                    email,
                    license,
                    secreteKey,
                    hits: 1
                });
                // Save the Developer to the database
                yield newAuth.save();
                return { license, secreteKey };
            }
            catch (error) {
                console.error('Error inserting website:', error);
                return null;
            }
        });
    }
    JWTF(auth) {
        const userJwt = (0, jwt_1.jwtGenerate)({
            verify: true,
            data: {
                userId: auth.id,
                email: auth.email,
                username: auth.name,
                applications: auth.applications,
                expiresAt: ""
            }
        });
        return userJwt;
    }
    getAuthByLicense(license) {
        return __awaiter(this, void 0, void 0, function* () {
            this._collection = this._db.getCollection('Auth');
            const Auth = yield this._collection.findOne({ license });
            return Auth;
        });
    }
    getAuthByToken(resetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            this._collection = this._db.getCollection('Auth');
            const Auth = yield this._collection.findOne({ resetToken });
            return Auth;
        });
    }
    getAuthByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            this._collection = this._db.getCollection('Auth');
            const Auth = yield this._collection.findOne({ email });
            return Auth;
        });
    }
    signUp(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authentication(user);
        });
    }
    forgetPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var auth = yield this.getAuthByEmail(user.email);
            if (auth) {
                auth.resetToken = security_1.default.createRandomToken().replace('/', '-').replace('=', '-');
                auth.resetExpired = new Date(Date.now() + 3600000); // 1 hour
                yield auth.save();
                return auth;
            }
            return null;
        });
    }
    signIn(existingUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authentication(existingUser);
        });
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.MongoDBManager)),
    __metadata("design:paramtypes", [mongodb_manager_1.MongoDBManager])
], AuthRepository);
