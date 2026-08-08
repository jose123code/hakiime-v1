import forge from 'node-forge';
import md5 from 'md5';
import fs from 'fs';
import path from 'path';

// Create logs directory if not exists
export const servicesKDirectory = path.join(__dirname, '../../keyConfig/services');
if (!require('fs').existsSync(servicesKDirectory)) {
  require('fs').mkdirSync(servicesKDirectory);
}


/**
 * A helper class for encryption operations using Forge library.
 */
class EncryptionHelper{
    /**
     * Encrypts data using AES-CBC algorithm.
     * @param key The encryption key.
     * @param iv The initialization vector.
     * @param payload The data to be encrypted.
     * @returns The Base64-encoded encrypted data.
     */
    static encrypt(key: string, iv: string, payload: Record<string, any>): string {
        const cipher = forge.cipher.createCipher('AES-CBC', forge.util.createBuffer(key));
        cipher.start({ iv });
        const payloadString = JSON.stringify(payload);
        cipher.update(forge.util.createBuffer(payloadString, 'utf8'));
        cipher.finish();
        const encryptedBytes = cipher.output.getBytes();
        return forge.util.encode64(encryptedBytes);
    }

    /**
     * Decrypts data using AES-CBC algorithm.
     * @param keyBase64 The Base64-encoded encryption key.
     * @param ivBase64 The Base64-encoded initialization vector.
     * @param cryptedData The Base64-encoded encrypted data.
     * @returns The decrypted data.
     */
    static decrypt(keyBase64: string, ivBase64: string, cryptedData: string): Record<string, any> {
        const encryptedBytes = forge.util.decode64(cryptedData);
        const key = forge.util.decode64(keyBase64);
        const iv = forge.util.decode64(ivBase64);
        const decipher = forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({ iv });
        decipher.update(forge.util.createBuffer(encryptedBytes));
        decipher.finish();
        const decryptedPayload = decipher.output.toString();
        return JSON.parse(decryptedPayload);
    }

    /**
     * Generates encryption key from secret key.
     * @param seckey The secret key.
     * @returns The generated encryption key.
     */
    static getKey(seckey: string): string {
        const keymd5 = md5(seckey);
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
    static cleanKey(seckey: string): string {
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
    private static generateKeyPair(): { publicKey: string; privateKey: string } {
        const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
        const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
        const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
        return { publicKey, privateKey };
    }

     /**
     * Generates RSA key pair and saves them in the specified directory.
     * @param secretKey The prefix for the key files.
     * @returns An object containing the paths of the generated public and private key files.
     */
     static generateAndSaveKeyPair(secretKey: string): { publicKeyPath: string; privateKeyPath: string } {
        secretKey = EncryptionHelper.cleanKey(secretKey);
        // Define file paths
        const publicKeyPath = path.join(servicesKDirectory, `${secretKey}_public.pem`);
        const privateKeyPath = path.join(servicesKDirectory, `${secretKey}_private.pem`);

        const { publicKey, privateKey } = EncryptionHelper.generateKeyPair();
        // Write keys to files
        fs.writeFileSync(publicKeyPath, publicKey);
        fs.writeFileSync(privateKeyPath, privateKey);

        return { publicKeyPath, privateKeyPath };
    }

   /**
     * Reads a key from a file.
     * @param filePath The path of the key file.
     * @returns The key read from the file.
     */
    private static getKeyFromFile(filePath: string): string {
        try {
            // Read key from file synchronously
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            console.error(`Error reading key file ${filePath}:`, error);
            throw error; // Rethrow the error to propagate it
        }
    }

    /**
     * Reads a public key from a file.
     * @param secretKey The path of the public key file.
     * @returns The public key read from the file.
     */
    static getPublicKeyFromFile(secretKey: string): string {
        secretKey = EncryptionHelper.cleanKey(secretKey);
        const publicKeyPath = path.join(servicesKDirectory, `${secretKey}_public.pem`);

        return EncryptionHelper.getKeyFromFile(publicKeyPath);
    }

    /**
     * Reads a private key from a file.
     * @param secretKey The path of the private key file.
     * @returns The private key read from the file.
     */
    static getPrivateKeyFromFile(secretKey: string): string {
        secretKey = EncryptionHelper.cleanKey(secretKey);
        const privateKeyPath = path.join(servicesKDirectory, `${secretKey}_private.pem`);
        return EncryptionHelper.getKeyFromFile(privateKeyPath);
    }

    /**
     * Encrypts data using RSA public key.
     * @param data The data to encrypt.
     * @param secretKey The RSA public key.
     * @returns The Base64-encoded encrypted data.
     */
    static encryptData(data: any, secretKey: string): string {
        secretKey = EncryptionHelper.cleanKey(secretKey);
        var publicKey = EncryptionHelper.getPublicKeyFromFile(secretKey);
        const cipher = forge.pki.publicKeyFromPem(publicKey);
        const encryptedData = cipher.encrypt(forge.util.encodeUtf8(JSON.stringify(data)), 'RSA-OAEP');
        return forge.util.encode64(encryptedData);
    }

    /**
     * Decrypts data using RSA private key.
     * @param encryptedData The Base64-encoded encrypted data.
     * @param secretKey The RSA private key.
     * @returns The decrypted data.
     */
    static decryptData(encryptedData: string, secretKey: string): any {
        secretKey = EncryptionHelper.cleanKey(secretKey);
        var privateKey = EncryptionHelper.getPrivateKeyFromFile(secretKey);
        const decipher = forge.pki.privateKeyFromPem(privateKey);
        const encryptedBytes = forge.util.decode64(encryptedData);
        const decryptedData = decipher.decrypt(encryptedBytes, 'RSA-OAEP');
        return JSON.parse(decryptedData);
    }

    static createRandomToken(){
       var token = forge.random.getBytesSync(32);
       return EncryptionHelper.cleanKey(forge.util.encode64(token))
    }
}

export default EncryptionHelper;


