import { Application } from "../entities/Application";
import { 
  IApplicationRepository,
  IApplication 
} from "../../interfaces";
import { inject, injectable } from "inversify";
import { MongoDBManager } from "../../services/mongodb.manager";
import { INTERFACE_TYPE } from "../../utils";
import { Types,Model,Document } from "mongoose";

@injectable()
export class ApplicationRepository implements IApplicationRepository {
  private _db: MongoDBManager;
  private _collection: Model<IApplication, {}, {}, {}, Document<unknown, {}, IApplication> & IApplication & {
    _id: Types.ObjectId;
  }, any>;
  constructor(
    @inject(INTERFACE_TYPE.MongoDBManager) db: MongoDBManager
  ) {
    this._db = db; // Assign the injected MongoDBManager to the class property

  }

  async create(data: Application): Promise<Document<unknown, {}, IApplication> & IApplication & {
    _id: Types.ObjectId;
} | null> {
    this._collection = this._db.getCollection<IApplication>('Application');
    
    try {
      let url = data.url;
      let name = data.name;
      let callbackUrl = data.callback;
      let description = data.description;
      let token = data.token;
      // Get the application collection

      // Check if a application with the given URL already exists
      const existingApplication = await this._collection.findOne({ url });
      if (existingApplication) {
        // console.log('application already exists:', existingApplication._id);
        return existingApplication;
      }
      
      // Create a new Application instance
      const newApplication = new this._collection({
        name,
        token,
        url,
        description,
        callbackUrl
      });

      // Save the Application to the database
      const savedApplication = await newApplication.save();
      

      return savedApplication;
    } catch (error) {
      console.error('Error inserting website:', error);
      return null;
    }
    
  }
  async update(id: number, {name,url,description,callback,token}: Application): Promise<Application> {
    throw new Error("not yet implimented");
    
  }
  async findApplication(id: string): Promise<(Document<unknown, {}, IApplication> & IApplication & {
    _id: Types.ObjectId;
  }) | null> {
    this._collection = this._db.getCollection<IApplication>('Application');
    const app = await this._collection.findById(id).exec();
    return app;
  }

  async findAppByToken(token: string): Promise<(Document<unknown, {}, IApplication> & IApplication & {
    _id: Types.ObjectId;
  }) | null> {
    this._collection = this._db.getCollection<IApplication>('Application');
    const app = await this._collection.findOne({ token });
    return app;
  }
}
