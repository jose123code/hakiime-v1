
import { Router } from "express";
import { NextFunction, Request, Response } from "express";
import EncryptionHelper from "../../../../common/security";
import forge from 'node-forge';




export const Test = (router: Router) => {

    router.get('/testing', (req: Request, res: Response, next: NextFunction) => {
        // Generate a Triple-DES key with a size of 192 bits (32 bytes)
        const key = forge.random.getBytesSync(32);
        const iv = forge.random.getBytesSync(16);

        // Convert the key to Base64 string for storage/transmission
        const keyBase64 = EncryptionHelper.cleanKey(forge.util.encode64(key));
        const ivBase64 = EncryptionHelper.cleanKey(forge.util.encode64(iv));

        // Generate asymmetric key pair
        const { publicKeyPath, privateKeyPath } = EncryptionHelper.generateAndSaveKeyPair('HKMSECK-' + keyBase64);
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
            "getKey": EncryptionHelper.getKey('HKMSECK-' + keyBase64),
            'encrypt': EncryptionHelper.encrypt(forge.util.decode64(keyBase64), forge.util.decode64(EncryptionHelper.getKey('HKMSECK-' + keyBase64)), {
                "userId": "6611bb59805fe584aca92b96",
                "email": "abdulehaikumarshal@gmail.com",
                "username": "hakeeem shamaavu",
                "applications": [],
                "expiresAt": "",
                "iat": 1712438105
            }),
            // "decrypt":decrypt()
        });
    })

    router.get('/test/:token', (req, res) => {
        const token = req.params.token;
        // Now you can use the token value as needed
        console.log('Token:', token);
        // Send a response or perform other operations
        res.status(200).json({token:token});
    });

    return router;
};



