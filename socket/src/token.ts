import jwt from 'jsonwebtoken';
import fs from 'fs';
import * as path from 'path';

export interface Key {
    key:string;
    passphrase:string;
  }

class TokenManager {
    private static privateKey: Key;
    private static publicKey: string;
    private static passphrase: string;

    static initializeFromConfig(configPath: string): void {
        const configData = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configData);

        if (config) {

            const privateKeyPath = path.resolve(__dirname, config.privateKeyPath);
            const publicKeyPath = path.resolve(__dirname, config.publicKeyPath);
            this.privateKey = {
                key:fs.readFileSync(privateKeyPath, 'utf-8'),
                passphrase:config.passphrase
            }
            this.publicKey = fs.readFileSync(publicKeyPath, 'utf-8');
        } else {
            throw new Error(`Failed to load configuration from ${configPath}`);
        }
    }

    static generateToken(payload: any): string {
        return jwt.sign(payload, this.privateKey, { algorithm: 'RS256' });
    }

    static verifyToken(token: string): any | null {
        try {
            return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] });
        } catch (error) {
            return null;
        }
    }

    static isExpired(token: string): boolean {
        const decoded = this.verifyToken(token);
        if (decoded && decoded.exp) {
            const currentTime = Math.floor(Date.now() / 1000);
            return currentTime > decoded.exp;
        }
        return true; // Token is considered expired if exp claim is missing
    }
}

const configPath = path.resolve(__dirname, '../config.json');
// Usage example:

TokenManager.initializeFromConfig(configPath);
export default TokenManager;