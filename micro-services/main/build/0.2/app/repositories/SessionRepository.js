"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.SessionRepository = void 0;
const inversify_1 = require("inversify");
const mongodb_manager_1 = require("../../services/mongodb.manager");
const utils_1 = require("../../utils");
let SessionRepository = class SessionRepository {
    constructor(db) {
        this._db = db; // Assign the injected MongoDBManager to the class property
    }
    getById(idSession) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._collection = this._db.getCollection('Session');
                return yield this._collection.findOne({ idSession });
            }
            catch (error) {
                console.error('Error finding session by id:', error);
                return null;
            }
        });
    }
    // async getAll(): Promise<Document<unknown, {}, ISession> & ISession & {
    //   _id: Types.ObjectId;
    //   }[]| null> {
    //   try {
    //     this._collection = this._db.getCollection<ISession>('Session');
    // Note no `await` here
    // const cursor = User.find().cursor();
    // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    // Use `doc`
    // }
    // for await (const doc of User.find()) {
    // use `doc`
    // }
    //     return await this._collection.find({});
    //   } catch (error) {
    //     console.error('Error getting all sessions:', error);
    //     return null;
    //   }
    // }
    create(session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._collection = this._db.getCollection('Session');
                var newSession = new this._collection({
                    idSession: session.idSession,
                    session: session.session,
                    expires: session.expires
                });
                yield newSession.save();
            }
            catch (error) {
                console.error('Error creating session:', error);
            }
        });
    }
    update(idSession, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._collection = this._db.getCollection('Session');
                var ses = yield this._collection.findOne({ idSession });
                if (ses) {
                    ses.session = session.session;
                    ses.expires = session.expires;
                    yield ses.save();
                }
                else {
                    yield this.create(session);
                }
                // await this._collection.replaceOne({ idSession }, session);
            }
            catch (error) {
                console.error('Error updating session:', error);
            }
        });
    }
    delete(idSession) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._collection = this._db.getCollection('Session');
                yield this._collection.deleteOne({ idSession });
            }
            catch (error) {
                console.error('Error deleting session:', error);
            }
        });
    }
};
exports.SessionRepository = SessionRepository;
exports.SessionRepository = SessionRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.MongoDBManager)),
    __metadata("design:paramtypes", [mongodb_manager_1.MongoDBManager])
], SessionRepository);
