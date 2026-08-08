"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesKDirectory = void 0;
const node_forge_1 = __importDefault(require("node-forge"));
const md5_1 = __importDefault(require("md5"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Create logs directory if not exists
exports.servicesKDirectory = path_1.default.join(__dirname, '../../keyConfig/services');
if (!require('fs').existsSync(exports.servicesKDirectory)) {
    require('fs').mkdirSync(exports.servicesKDirectory);
}
/**
 * A helper class for encryption operations using Forge library.
 */
class EncryptionHelper {
    /**
     * Encrypts data using AES-CBC algorithm.
     * @param key The encryption key.
     * @param iv The initialization vector.
     * @param payload The data to be encrypted.
     * @returns The Base64-encoded encrypted data.
     */
    static encrypt(key, iv, payload) {
        const cipher = node_forge_1.default.cipher.createCipher('AES-CBC', node_forge_1.default.util.createBuffer(key));
        cipher.start({ iv });
        const payloadString = JSON.stringify(payload);
        cipher.update(node_forge_1.default.util.createBuffer(payloadString, 'utf8'));
        cipher.finish();
        const encryptedBytes = cipher.output.getBytes();
        return node_forge_1.default.util.encode64(encryptedBytes);
    }
    /**
     * Decrypts data using AES-CBC algorithm.
     * @param keyBase64 The Base64-encoded encryption key.
     * @param ivBase64 The Base64-encoded initialization vector.
     * @param cryptedData The Base64-encoded encrypted data.
     * @returns The decrypted data.
     */
    static decrypt(keyBase64, ivBase64, cryptedData) {
        const encryptedBytes = node_forge_1.default.util.decode64(cryptedData);
        const key = node_forge_1.default.util.decode64(keyBase64);
        const iv = node_forge_1.default.util.decode64(ivBase64);
        const decipher = node_forge_1.default.cipher.createDecipher('AES-CBC', key);
        decipher.start({ iv });
        decipher.update(node_forge_1.default.util.createBuffer(encryptedBytes));
        decipher.finish();
        const decryptedPayload = decipher.output.toString();
        return JSON.parse(decryptedPayload);
    }
    /**
     * Generates encryption key from secret key.
     * @param seckey The secret key.
     * @returns The generated encryption key.
     */
    static getKey(seckey) {
        const keymd5 = (0, md5_1.default)(seckey);
        const keymd5last12 = keymd5.substr(-12);
        const seckeyadjusted = seckey.replace('HKMSECK-', '');
        const seckeyadjustedfirst12 = seckeyadjusted.substr(0, 12);
        return EncryptionHelper.cleanKey(seckeyadjustedfirst12 + keymd5last12);
    }
    /**
     * Cleans encryption key.
     * @param seckey The encryption key to clean.
     * @returns The cleaned encryption key.
     */
    static cleanKey(seckey) {
        var key = seckey.replace('+', 'L');
        key = key.replace('HKMSECK-', '');
        key = key.replace('/', '0');
        key = key.replace('HKMIVYS-', '');
        return key;
    }
    /**
     * Generates RSA key pair.
     * @returns An object containing the public and private keys.
     */
    static generateKeyPair() {
        const keyPair = node_forge_1.default.pki.rsa.generateKeyPair({ bits: 2048 });
        const publicKey = node_forge_1.default.pki.publicKeyToPem(keyPair.publicKey);
        const privateKey = node_forge_1.default.pki.privateKeyToPem(keyPair.privateKey);
        return { publicKey, privateKey };
    }
    /**
    * Generates RSA key pair and saves them in the specified directory.
    * @param secretKey The prefix for the key files.
    * @returns An object containing the paths of the generated public and private key files.
    */
    static generateAndSaveKeyPair(secretKey) {
        secretKey = EncryptionHelper.cleanKey(secretKey);
        // Define file paths
        const publicKeyPath = path_1.default.join(exports.servicesKDirectory, `${secretKey}_public.pem`);
        const privateKeyPath = path_1.default.join(exports.servicesKDirectory, `${secretKey}_private.pem`);
        const { publicKey, privateKey } = EncryptionHelper.generateKeyPair();
        // Write keys to files
        fs_1.default.writeFileSync(publicKeyPath, publicKey);
        fs_1.default.writeFileSync(privateKeyPath, privateKey);
        return { publicKeyPath, privateKeyPath };
    }
    /**
      * Reads a key from a file.
      * @param filePath The path of the key file.
      * @returns The key read from the file.
      */
    static getKeyFromFile(filePath) {
        try {
            // Read key from file synchronously
            return fs_1.default.readFileSync(filePath, 'utf8');
        }
        catch (error) {
            console.error(`Error reading key file ${filePath}:`, error);
            throw error; // Rethrow the error to propagate it
        }
    }
    /**
     * Reads a public key from a file.
     * @param secretKey The path of the public key file.
     * @returns The public key read from the file.
     */
    static getPublicKeyFromFile(secretKey) {
        secretKey = EncryptionHelper.cleanKey(secretKey);
        const publicKeyPath = path_1.default.join(exports.servicesKDirectory, `${secretKey}_public.pem`);
        return EncryptionHelper.getKeyFromFile(publicKeyPath);
    }
    /**
     * Reads a private key from a file.
     * @param secretKey The path of the private key file.
     * @returns The private key read from the file.
     */
    static getPrivateKeyFromFile(secretKey) {
        secretKey = EncryptionHelper.cleanKey(secretKey);
        const privateKeyPath = path_1.default.join(exports.servicesKDirectory, `${secretKey}_private.pem`);
        return EncryptionHelper.getKeyFromFile(privateKeyPath);
    }
    /**
     * Encrypts data using RSA public key.
     * @param data The data to encrypt.
     * @param secretKey The RSA public key.
     * @returns The Base64-encoded encrypted data.
     */
    static encryptData(data, secretKey) {
        secretKey = EncryptionHelper.cleanKey(secretKey);
        var publicKey = EncryptionHelper.getPublicKeyFromFile(secretKey);
        const cipher = node_forge_1.default.pki.publicKeyFromPem(publicKey);
        const encryptedData = cipher.encrypt(node_forge_1.default.util.encodeUtf8(JSON.stringify(data)), 'RSA-OAEP');
        return node_forge_1.default.util.encode64(encryptedData);
    }
    /**
     * Decrypts data using RSA private key.
     * @param encryptedData The Base64-encoded encrypted data.
     * @param secretKey The RSA private key.
     * @returns The decrypted data.
     */
    static decryptData(encryptedData, secretKey) {
        secretKey = EncryptionHelper.cleanKey(secretKey);
        var privateKey = EncryptionHelper.getPrivateKeyFromFile(secretKey);
        const decipher = node_forge_1.default.pki.privateKeyFromPem(privateKey);
        const encryptedBytes = node_forge_1.default.util.decode64(encryptedData);
        const decryptedData = decipher.decrypt(encryptedBytes, 'RSA-OAEP');
        return JSON.parse(decryptedData);
    }
    static createRandomToken() {
        var token = node_forge_1.default.random.getBytesSync(32);
        return EncryptionHelper.cleanKey(node_forge_1.default.util.encode64(token));
    }
}
exports.default = EncryptionHelper;
