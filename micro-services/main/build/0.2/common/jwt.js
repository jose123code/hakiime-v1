"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.jwtGenerate = void 0;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var conf = path_1.default.resolve(__dirname, '../../keyConfig/system', 'config.json');
const rawData = fs.readFileSync(conf, 'utf-8');
var config = JSON.parse(rawData);
// Read the private and public keys from files
const privateKey = fs.readFileSync(path_1.default.resolve(__dirname, '../../keyConfig/system', config.privateKeyPath), 'utf8');
const publicKey = fs.readFileSync(path_1.default.resolve(__dirname, '../../keyConfig/system', config.publicKeyPath), 'utf8');
const jwtGenerate = (payload) => {
    return jsonwebtoken_1.default.sign(payload, { key: privateKey, passphrase: config.passphrase }, { algorithm: 'RS256' });
};
exports.jwtGenerate = jwtGenerate;
/**
 * Verify a JWT token.
 * @param {string} token The token to verify.
 * @returns {Promise<Object>} A promise that resolves with the decoded token payload.
 */
function verifyToken(token) {
    try {
        var res = jsonwebtoken_1.default.verify(token, publicKey, { algorithms: ['RS256'] });
        return res;
    }
    catch (error) {
        return error;
    }
}
exports.verifyToken = verifyToken;
