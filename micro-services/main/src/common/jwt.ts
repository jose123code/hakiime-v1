import path from "path";
import * as fs from 'fs';
import jwt, { VerifyErrors } from 'jsonwebtoken';

var conf = path.resolve(__dirname, '../../keyConfig/system', 'config.json')
const rawData = fs.readFileSync(conf, 'utf-8');
var config =  JSON.parse(rawData);

// Read the private and public keys from files
const privateKey = fs.readFileSync(path.resolve(__dirname, '../../keyConfig/system', config.privateKeyPath), 'utf8');
const publicKey = fs.readFileSync(path.resolve(__dirname, '../../keyConfig/system', config.publicKeyPath), 'utf8');

export const jwtGenerate = (payload:any):string =>{
   return jwt.sign(payload, { key: privateKey, passphrase: config.passphrase }, { algorithm: 'RS256' });
}

/**
 * Verify a JWT token.
 * @param {string} token The token to verify.
 * @returns {Promise<Object>} A promise that resolves with the decoded token payload.
 */
export function verifyToken<T>(token:string):T|VerifyErrors {
   
    try {
        var res =  jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        return res as T;
    } catch (error) {
        return error as VerifyErrors;
    }
  }
  