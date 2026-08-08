"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.applicationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        index: true
    },
    url: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
    },
    callbackUrl: {
        type: String,
        required: true
    },
    calls: {
        type: Number,
        default: 0,
    },
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
