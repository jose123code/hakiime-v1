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
exports.MongoDBManager = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const inversify_1 = require("inversify");
const Application_schema_1 = require("../schemas/Application.schema");
const Developer_schema_1 = require("../schemas/Developer.schema");
const Language_schema_1 = require("../schemas/Language.schema");
const utils_1 = require("../utils");
const Auth_schema_1 = require("../schemas/Auth.schema");
const Client_schema_1 = require("../schemas/Client.schema");
const Device_schema_1 = require("../schemas/Device.schema");
const DeviceDetector_schema_1 = require("../schemas/DeviceDetector.schema");
const OS_schema_1 = require("../schemas/OS.schema");
const Session_schema_1 = require("../schemas/Session.schema");
let MongoDBManager = class MongoDBManager {
    constructor(configManager) {
        this.isConnected = false;
        this.configuration_manager = configManager;
        var data = this.configuration_manager.getConfig();
        this.mongodb = data.mongos;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isConnected = mongoose_1.default.connection.readyState === 1;
            if (!this.isConnected) {
                try {
                    const { hostname, user, pwd, port, database } = this.mongodb[process.env.ENVIRONMENT || 'dev'];
                    const connectionString = `mongodb://${user}:${encodeURIComponent(pwd)}@${hostname}:${port}/${database}?authMechanism=DEFAULT&directConnection=true`;
                    yield mongoose_1.default.connect(connectionString);
                    console.log(`Connected to MongoDB at ${hostname}:${port}, Database: ${database}`);
                    this.isConnected = true;
                    mongoose_1.default.model('Application', Application_schema_1.applicationSchema);
                    mongoose_1.default.model('Developer', Developer_schema_1.developerSchema);
                    mongoose_1.default.model('Language', Language_schema_1.languageSchema);
                    mongoose_1.default.model('DeviceDetector', DeviceDetector_schema_1.deviceDetectorSchema);
                    mongoose_1.default.model('Auth', Auth_schema_1.authSchema);
                    mongoose_1.default.model('Device', Device_schema_1.deviceSchema);
                    mongoose_1.default.model('Client', Client_schema_1.clientSchema);
                    mongoose_1.default.model('Os', OS_schema_1.osSchema);
                    mongoose_1.default.model('Session', Session_schema_1.sessionSchema);
                }
                catch (error) {
                    console.error('Error connecting to MongoDB:', error);
                    throw error;
                }
            }
        });
    }
    close() {
        if (this.isConnected) {
            mongoose_1.default.disconnect();
            console.log('MongoDB connection closed');
            this.isConnected = false;
        }
    }
    getCollection(name) {
        return mongoose_1.default.model(name);
    }
};
MongoDBManager = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.ConfigurationManager)),
    __metadata("design:paramtypes", [Object])
], MongoDBManager);
exports.MongoDBManager = MongoDBManager;
