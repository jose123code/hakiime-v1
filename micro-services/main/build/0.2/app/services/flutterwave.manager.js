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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flutterwave = void 0;
const utils_1 = require("../utils");
const request_1 = __importDefault(require("request"));
const querystring_1 = __importDefault(require("querystring"));
const inversify_1 = require("inversify");
let Flutterwave = class Flutterwave {
    constructor(configManager) {
        var config = configManager.getConfig().flutterwave[process.env.ENVIRONMENT || 'dev'];
        this.public_key = config.public_key;
        this.secret_key = config.secret_key;
        this._base_url = (0, utils_1.initDefaultValue)(config.base_url, 'https://api.flutterwave.com/');
    }
    getPublicKey() {
        return this.public_key;
    }
    ;
    getSecretKey() {
        return this.secret_key;
    }
    ;
    getBaseUrl() {
        return this._base_url;
    }
    ;
    request(path, payload, callback) {
        var requestOptions = {
            uri: "",
            baseUrl: "",
            method: "",
            json: false,
            headers: {}
        };
        var requestMethod = (0, utils_1.initDefaultValue)(payload.method, 'POST' || 'PUT');
        var datakey = requestMethod == 'POST' || 'PUT' ? 'body' : 'qs';
        var requestJSON = datakey == 'body' ? true : false;
        var includeQueryParams = (0, utils_1.initDefaultValue)(payload.excludeQuery, false);
        if (requestMethod === 'GET') {
            delete payload.method;
            if (includeQueryParams == true) {
                delete payload.excludeQuery;
                requestOptions.uri = path;
            }
            else {
                const queryParams = querystring_1.default.stringify(payload);
                requestOptions.uri = path += `${queryParams}`;
            }
        }
        else {
            requestOptions.uri = path;
        }
        requestOptions.baseUrl = this.getBaseUrl();
        requestOptions.method = requestMethod;
        requestOptions[datakey] = (0, utils_1.initDefaultValue)(payload, {});
        requestOptions.json = requestJSON;
        requestOptions.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getSecretKey()}`,
        };
        // console.log(requestOptions);
        if (callback) {
            this._makeRequest(requestOptions, callback);
            return requestOptions;
        }
        else {
            return this._makePromiseRequest(requestOptions);
        }
    }
    ;
    _makeRequest(requestOptions, callback) {
        (0, request_1.default)(requestOptions, function (err, res, body) {
            var r = res;
            if (typeof res == 'undefined') {
                r = {};
            }
            if (typeof body == 'undefined') {
                body = {};
            }
            callback(err, res, body);
        });
    }
    _makePromiseRequest(requestOptions) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self._makeRequest(requestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ res, body });
                }
            });
        });
    }
    ;
};
Flutterwave = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.ConfigurationManager)),
    __metadata("design:paramtypes", [Object])
], Flutterwave);
exports.Flutterwave = Flutterwave;
