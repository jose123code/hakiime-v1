export interface IEncryptionHelper {
    /**
    * Encrypts data using AES-CBC algorithm.
    * @param key The encryption key.
    * @param iv The initialization vector.
    * @param payload The data to be encrypted.
    * @returns The Base64-encoded encrypted data.
    */
    encrypt(key: string, iv: string, payload: Record<string, any>): string;

   /**
    * Decrypts data using AES-CBC algorithm.
    * @param keyBase64 The Base64-encoded encryption key.
    * @param ivBase64 The Base64-encoded initialization vector.
    * @param cryptedData The Base64-encoded encrypted data.
    * @returns The decrypted data.
    */
   decrypt(keyBase64: string, ivBase64: string, cryptedData: string): Record<string, any>;

   /**
    * Generates encryption key from secret key.
    * @param seckey The secret key.
    * @returns The generated encryption key.
    */
   getKey(seckey: string): string;

   /**
    * Generates RSA key pair and saves them in the specified directory.
    * @param secretKey The prefix for the key files.
    * @returns An object containing the paths of the generated public and private key files.
    */
   generateAndSaveKeyPair(secretKey: string): { publicKeyPath: string; privateKeyPath: string };

   /**
    * Reads a public key from a file.
    * @param secretKey The prefix for the key files.
    * @returns The public key read from the file.
    */
   getPublicKeyFromFile(secretKey: string): string;

   /**
    * Reads a private key from a file.
    * @param secretKey The prefix for the key files.
    * @returns The private key read from the file.
    */
   getPrivateKeyFromFile(secretKey: string): string;

   /**
    * Encrypts data using RSA public key.
    * @param data The data to encrypt.
    * @param secretKey The RSA public key.
    * @returns The Base64-encoded encrypted data.
    */
   encryptData(data: any, secretKey: string): string;

   /**
    * Decrypts data using RSA private key.
    * @param encryptedData The Base64-encoded encrypted data.
    * @param secretKey The RSA private key.
    * @returns The decrypted data.
    */
   decryptData(encryptedData: string, secretKey: string): any;
}