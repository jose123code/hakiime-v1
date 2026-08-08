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
exports.developerSchema = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
exports.developerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    phone: {
        type: Number,
        unique: false,
        index: true,
        default: 0
    },
    address: {
        type: String,
        default: "",
    },
    born: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
    },
    applications: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Application'
        }],
    languages: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Languages'
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
            delete ret.password;
            delete ret.__v;
        },
    },
});
exports.developerSchema.pre('save', function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            const hashed = yield common_1.Password.toHash(this.get('password'));
            this.set('password', hashed);
        }
        done();
    });
});
