"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = exports.Authentication = void 0;
class Authentication {
    constructor(email, secreteKey, license, hits, devices) {
        this.email = email;
        this.secreteKey = secreteKey;
        this.license = license;
        this.hits = hits;
        this.devices = devices;
    }
}
exports.Authentication = Authentication;
class Auth {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
exports.Auth = Auth;
