import { Agent } from 'https';

export interface EnvironmentConfig {
    username: string;
    password: string | null; // Password can be null in some cases
    database: string;
    host: string;
    dialect: string;
}

export interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    tls: {
        rejectUnauthorized: boolean;
        agent?: Agent;
    };
}

export interface RabbitMQConfig {
    hostname: string;
    password: string;
    username: string;
    port: number;
    
}

export interface MongoDBConfig {
    hostname: string;
    user: string;
    pwd: string;
    port: number; // You might want to change this to number if port is always a number
    database: string;
}

export interface RedisConfig {
    port: number; // Assuming port is a number
    username: string;
    host: string;
    password: string;
}

export interface mongosDb{
    dev: MongoDBConfig;
    test: MongoDBConfig;
}

export interface FlutterwaveKeys{
    public_key:string;
    secret_key:string;
    base_url:string;
}

export interface ApplicationConfig {
    dev: EnvironmentConfig;
    test: EnvironmentConfig;
    prod: EnvironmentConfig;
    emailConfig: EmailConfig;
    rabbitMQ: {
        dev: RabbitMQConfig;
        test: RabbitMQConfig;
        protocol: string;
        locale: string,
        frameMax: number,
        heartbeat: number,
        vhost: string,
    };
    mongos: mongosDb;
    redis: {
        dev: RedisConfig;
        test: RedisConfig;
    };
    flutterwave:{
        dev: FlutterwaveKeys;
        test: FlutterwaveKeys;
    };
}

export interface IConfig{
    getConfig(): ApplicationConfig|null;
}