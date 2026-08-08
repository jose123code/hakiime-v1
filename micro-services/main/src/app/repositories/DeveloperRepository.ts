import { Developer } from "../entities/Developer";
import { 
  IDeveloperRepository,
  IDeveloper
 } from "../../interfaces";
import { inject, injectable } from "inversify";
import { MongoDBManager } from "../../services/mongodb.manager";
import { INTERFACE_TYPE } from "../../utils";
import { Model, Types, Document } from "mongoose";

@injectable()
export class DeveloperRepository implements IDeveloperRepository {
  private _db: MongoDBManager;
  private _collection: Model<IDeveloper, {}, {}, {}, Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }, any>;
  constructor(
    @inject(INTERFACE_TYPE.MongoDBManager) db: MongoDBManager
  ) {
    this._db = db; // Assign the injected MongoDBManager to the class property

  }

  async create(data: Developer): Promise<Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
} | null> {
    this._collection = this._db.getCollection<IDeveloper>('Developer');

    try {
      let email = data.email;
      let name = data.name;
      let phone = data.phone;
      let password = data.password;
      // Get the Developer collection

      // Check if a Developer with the given URL already exists
      const existingDeveloperEmail = await this._collection.findOne({ email });
      const existingDeveloperPhone = await this._collection.findOne({ phone });
      if (existingDeveloperEmail) {
        console.log('Developer already exists with this email:', existingDeveloperEmail._id);
        return existingDeveloperEmail;
      }

      if (existingDeveloperPhone) {
        console.log('Developer already exists with this phone number:', existingDeveloperPhone._id);
        return existingDeveloperPhone;
      }

      // Create a new Developer instance
      const newDeveloper = new this._collection({
        name,
        email,
        phone,
        password
      });

      // Save the Developer to the database
      const savedDeveloper = await newDeveloper.save();

      return savedDeveloper;
    } catch (error) {
      console.error('Error inserting website:', error);
      return null;
    }

  }
  async update(doc:Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }):Promise<void> {
    await doc.save();
  }
  async updateApplication(id:string,applicationId:string): Promise<void>{
    this._collection = this._db.getCollection<IDeveloper>('Developer');
    // Find the developer by ID and update their applications array
    await this._collection.findByIdAndUpdate(id, { $push: { applications: applicationId } });
  }
  async find(limit: number, offset: number): Promise<Developer[]> {
    throw new Error("not yet implimented");

  }
  async findDeveloper(developerId: string): Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null> {
    this._collection = this._db.getCollection<IDeveloper>('Developer');
    const developer = await this._collection.findById(developerId).exec();
    return developer;
  }

  async findDeveloperEmail(developerEmail: string): Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null> {
    var email = developerEmail;
    this._collection = this._db.getCollection<IDeveloper>('Developer');
    const developer = await this._collection.findOne({ email });
    return developer;
  }

  async findDeveloperPhone(developerPhone: number): Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null> {
    var phone = developerPhone;
    this._collection = this._db.getCollection<IDeveloper>('Developer');
    const developer = await this._collection.findOne({ phone });
    return developer;
  }
}


