"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientSchema = void 0;
const mongoose_1 = require("mongoose");
exports.clientSchema = new mongoose_1.Schema({
    name: {
        type: String,
        index: true,
        required: true
    },
    short_name: {
        type: String,
        required: true,
        index: true
    },
    version: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        index: true
    },
    engine: {
        type: String,
        required: true,
        index: true
    },
    engine_version: {
        type: String,
        required: true,
        index: true
    },
    hits: {
        type: Number,
        default: 0
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
