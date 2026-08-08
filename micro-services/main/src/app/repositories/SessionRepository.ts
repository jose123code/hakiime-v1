import { Language } from "../entities/Language";
import { 
  ILanguage,
  ISession,
  ISessionRepository
} from "../../interfaces";
import { inject, injectable } from "inversify";
import { MongoDBManager } from "../../services/mongodb.manager";
import { INTERFACE_TYPE } from "../../utils";
import { Types,Model, Document} from "mongoose";
import { Session } from "../entities/Session";

@injectable()
export class SessionRepository implements ISessionRepository {
  private _db: MongoDBManager;
  private _collection: Model<ISession, {}, {}, {}, Document<unknown, {}, ISession> & ISession & {
    _id: Types.ObjectId;
  }, any>;
  constructor(
    @inject(INTERFACE_TYPE.MongoDBManager) db: MongoDBManager
  ) {
    this._db = db; // Assign the injected MongoDBManager to the class property

  }

  async getById(idSession: string): Promise<Document<unknown, {}, ISession> & ISession & {
    _id: Types.ObjectId;
    } | null> {
    try {
    this._collection = this._db.getCollection<ISession>('Session');
      return await this._collection.findOne({ idSession });
    } catch (error) {
      console.error('Error finding session by id:', error);
      return null;
    }
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

  async create(session: Session): Promise<void> {
    try {
      this._collection = this._db.getCollection<ISession>('Session');
      var newSession = new  this._collection({
          idSession: session.idSession,
          session: session.session,
          expires: session.expires
        });

      await newSession.save();

    } catch (error) {
      console.error('Error creating session:', error);
    }
  }

  async update(idSession: string, session: Session): Promise<void> {
    try {
      this._collection = this._db.getCollection<ISession>('Session');
      var ses = await this._collection.findOne({ idSession });
      if(ses){
        ses.session = session.session;
        ses.expires = session.expires;
        await ses.save();
      }else{
        await this.create(session);
      }
      // await this._collection.replaceOne({ idSession }, session);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }

  async delete(idSession: string): Promise<void> {
    try {
      this._collection = this._db.getCollection<ISession>('Session');
      await this._collection.deleteOne({idSession});
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }
}
