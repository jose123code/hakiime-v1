"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const inversify_config_1 = require("../inversify.config");
const utils_1 = require("../utils");
const start = (callback, queueName, type) => __awaiter(void 0, void 0, void 0, function* () {
    const hkmMQSingleton = inversify_config_1.container.get(utils_1.INTERFACE_TYPE.RabbitMqSingletonConnectionFactory);
    const connection = yield hkmMQSingleton.create();
    // Create a channel
    const channel = yield connection.createChannel();
    // Makes the queue available to the client
    yield channel.assertQueue(queueName, {
        durable: true,
    });
    // Send some messages to the queue
    callback(channel, queueName);
    if (type === 'sender') {
        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    }
});
exports.start = start;
