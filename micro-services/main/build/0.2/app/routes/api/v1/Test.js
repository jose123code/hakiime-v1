"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const security_1 = __importDefault(require("../../../../common/security"));
const node_forge_1 = __importDefault(require("node-forge"));
const Test = (router) => {
    router.get('/testing', (req, res, next) => {
        // Generate a Triple-DES key with a size of 192 bits (32 bytes)
        const key = node_forge_1.default.random.getBytesSync(32);
        const iv = node_forge_1.default.random.getBytesSync(16);
        // Convert the key to Base64 string for storage/transmission
        const keyBase64 = security_1.default.cleanKey(node_forge_1.default.util.encode64(key));
        const ivBase64 = security_1.default.cleanKey(node_forge_1.default.util.encode64(iv));
        // Generate asymmetric key pair
        const { publicKeyPath, privateKeyPath } = security_1.default.generateAndSaveKeyPair('HKMSECK-' + keyBase64);
        // Example usage
        const originalData = 'Sensitive data to be encrypted';
        // Encrypt the data using the public key
        // const encryptedData = encryptData(originalData, publicKey);
        // Decrypt the data using the private key
        // const decryptedData = decryptData(encryptedData, privateKey);
        return res.status(200).json({
            "key": 'HKMSECK-' + keyBase64,
            "iv": ivBase64,
            'Private Key': privateKeyPath,
            'Public Key': publicKeyPath,
            // 'Encrypted Data': encryptedData,
            // 'Decrypted Data': decryptedData,
            "getKey": security_1.default.getKey('HKMSECK-' + keyBase64),
            'encrypt': security_1.default.encrypt(node_forge_1.default.util.decode64(keyBase64), node_forge_1.default.util.decode64(security_1.default.getKey('HKMSECK-' + keyBase64)), {
                "userId": "6611bb59805fe584aca92b96",
                "email": "abdulehaikumarshal@gmail.com",
                "username": "hakeeem shamaavu",
                "applications": [],
                "expiresAt": "",
                "iat": 1712438105
            }),
            // "decrypt":decrypt()
        });
    });
    router.get('/test/:token', (req, res) => {
        const token = req.params.token;
        // Now you can use the token value as needed
        console.log('Token:', token);
        // Send a response or perform other operations
        res.status(200).json({ token: token });
    });
    return router;
};
exports.Test = Test;
