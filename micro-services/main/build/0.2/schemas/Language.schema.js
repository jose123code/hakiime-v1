"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.languageSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    abbr: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    devs: {
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
