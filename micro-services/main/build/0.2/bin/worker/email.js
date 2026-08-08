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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../../.env') });
const services_1 = require("../../services");
const mailer_1 = __importDefault(require("../../hooks/mailer"));
const mailing = (emailInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, mailer_1.default)(emailInfo);
        return result.messageId;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
// Function to send some messages before consuming the queue
const sendMessages = (channel, queueName) => {
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
    channel.consume(queueName, function (msg) {
        var email = JSON.parse(msg.content.toString());
        console.log(" [x] Working....");
        mailing(email).then((res) => {
            if (res) {
                console.log(" [x] Done");
                channel.ack(msg);
            }
            else {
                console.log(" [x] Failed");
                channel.ack(msg);
            }
        });
    }, {
        noAck: false
    });
};
(0, services_1.start)(sendMessages, 'mailer', 'worker');
