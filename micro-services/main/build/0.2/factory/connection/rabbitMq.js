"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqSingletonConnectionFactory = exports.RabbitMqConnectionFactory = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const bluebird_1 = __importDefault(require("bluebird"));
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
let RabbitMqConnectionFactory = class RabbitMqConnectionFactory {
    constructor(configManager) {
        this.configuration_manager = configManager;
        var data = this.configuration_manager.getConfig();
        const connConfi = data.rabbitMQ;
        const { hostname, username, password, port } = connConfi[process.env.ENVIRONMENT || 'dev'];
        const { protocol, locale, frameMax, heartbeat, vhost } = connConfi;
        this.connection = {
            protocol: protocol,
            locale: locale,
            frameMax: frameMax,
            heartbeat: heartbeat,
            vhost: vhost,
            hostname: hostname,
            username: username,
            password: password,
            port: port,
        };
        // console.log(this.connection);
        this.connectionConfig = connConfi;
    }
    create() {
        console.log('connecting to ' +
            this.connection.protocol +
            '://' +
            this.connection.hostname +
            ':' +
            this.connection.port);
        return bluebird_1.default.resolve(amqplib_1.default.connect(this.connection)).catch((err) => {
            console.log('failed to create connection ' +
                this.connection.protocol +
                '://' +
                this.connection.hostname +
                ':' +
                this.connection.port);
            return bluebird_1.default.reject(err);
        });
    }
};
exports.RabbitMqConnectionFactory = RabbitMqConnectionFactory;
exports.RabbitMqConnectionFactory = RabbitMqConnectionFactory = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.ConfigurationManager)),
    __metadata("design:paramtypes", [Object])
], RabbitMqConnectionFactory);
let RabbitMqSingletonConnectionFactory = class RabbitMqSingletonConnectionFactory {
    constructor(configManager) {
        this.promise = null;
        this.configuration_manager = configManager;
        var data = this.configuration_manager.getConfig();
        const connConfi = data.rabbitMQ;
        const { hostname, username, password, port } = connConfi[process.env.ENVIRONMENT || 'dev'];
        const { protocol, locale, frameMax, heartbeat, vhost } = connConfi;
        this.connection = {
            protocol: protocol,
            locale: locale,
            frameMax: frameMax,
            heartbeat: heartbeat,
            vhost: vhost,
            hostname: hostname,
            username: username,
            password: password,
            port: port,
        };
        // console.log(this.connection);
        this.connectionConfig = connConfi;
    }
    create() {
        if (this.promise) {
            console.log('reusing connection to ' +
                this.connection.protocol +
                '://' +
                this.connection.hostname +
                ':' +
                this.connection.port);
            return this.promise;
        }
        console.log('creating connection to ' +
            this.connection.protocol +
            '://' +
            this.connection.hostname +
            ':' +
            this.connection.port);
        return (this.promise = bluebird_1.default.resolve(amqplib_1.default.connect(this.connection)));
    }
};
exports.RabbitMqSingletonConnectionFactory = RabbitMqSingletonConnectionFactory;
exports.RabbitMqSingletonConnectionFactory = RabbitMqSingletonConnectionFactory = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.ConfigurationManager)),
    __metadata("design:paramtypes", [Object])
], RabbitMqSingletonConnectionFactory);
