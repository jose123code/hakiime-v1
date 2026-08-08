"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.sessionSchema = new mongoose_1.Schema({
    idSession: {
        type: String,
        index: true,
        required: true
    },
    session: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    expires: {
        type: Date,
        required: true
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
exports.sessionSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });
