"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchema = void 0;
const mongoose_1 = require("mongoose");
exports.authSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    secreteKey: {
        type: String,
        required: true,
        index: true
    },
    license: {
        type: String,
        required: true,
        index: true
    },
    resetToken: {
        type: String,
        default: "none",
        index: true
    },
    resetExpired: {
        type: Date,
    },
    hits: {
        type: Number,
        default: 0
    },
    devices: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'DeviceDetector'
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
