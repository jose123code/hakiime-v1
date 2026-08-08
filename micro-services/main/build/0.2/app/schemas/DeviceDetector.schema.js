"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceDetectorSchema = void 0;
const mongoose_1 = require("mongoose");
exports.deviceDetectorSchema = new mongoose_1.Schema({
    os: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Os'
        }],
    device: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Device'
        }],
    client: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Client'
        }],
    createdAt: {
        type: Date,
        default: () => new Date(),
        index: true
    },
    updatedAt: {
        type: Date,
        default: () => new Date(),
        index: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
