
import fs from 'fs';
import * as path from 'path';

export interface MysqlOptions {
    host: string; 
    user: string; 
    password: string; 
    database: string; 
    waitForConnections: boolean;
    connectionLimit: number;
    queueLimit: number;
  }

export interface RedisOptions {
    host: string; 
    port: number; 
    username: string;
    password: string;
  }

export interface Config {
    privateKeyPath: string;
    publicKeyPath: string;
    passphrase: string;
    
    mysqlOptions: MysqlOptions;

    redisOptions: RedisOptions;

    serverOptions: {
        port: number;
        host: string;
    }
  }

const configPath = path.resolve(__dirname, '../config.json');

const configData = fs.readFileSync(configPath, 'utf-8');

const config:Config = JSON.parse(configData);

export default config;