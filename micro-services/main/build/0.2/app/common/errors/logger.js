"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChildLogger = exports.Logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
// Create logs directory if not exists
const logsDirectory = path_1.default.join(__dirname, '../../../../logs');
if (!require('fs').existsSync(logsDirectory)) {
    require('fs').mkdirSync(logsDirectory);
}
// Setup Winston Logger
exports.Logger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(logsDirectory, 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
        }),
    ],
});
function createChildLogger(logger, className) {
    return logger.child({ child: "rabbitmq-pub-sub", "class": className }, true);
}
exports.createChildLogger = createChildLogger;
