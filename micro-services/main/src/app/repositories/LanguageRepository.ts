import { Language } from "../entities/Language";
import { 
  ILanguageRepository ,
  ILanguage
} from "../../interfaces";
import { inject, injectable } from "inversify";
import { MongoDBManager } from "../../services/mongodb.manager";
import { INTERFACE_TYPE } from "../../utils";
import { Types,Model, Document} from "mongoose";

@injectable()
export class LanguageRepository implements ILanguageRepository {
  private _db: MongoDBManager;
  private _collection: Model<ILanguage, {}, {}, {}, Document<unknown, {}, ILanguage> & ILanguage & {
    _id: Types.ObjectId;
  }, any>;
  constructor(
    @inject(INTERFACE_TYPE.MongoDBManager) db: MongoDBManager
  ) {
    this._db = db; // Assign the injected MongoDBManager to the class property

  }

  async create(data: Language): Promise<ILanguage | null> {
    this._collection = this._db.getCollection<ILanguage>('Language');
    
    try {
      let abbr = data.abbr;
      let name = data.name;
      // Get the Language collection

      // Check if a Language with the given URL already exists
      const existingLanguage = await this._collection.findOne({ name });
      if (existingLanguage) {
        console.log('Language already exists:', existingLanguage);
        return existingLanguage;
      }
      
      // Create a new Language instance
      const newLanguage = new this._collection({
        name,
        abbr
      });

      // Save the Language to the database
      const savedLanguage = await newLanguage.save();

      return savedLanguage;
    } catch (error) {
      console.error('Error inserting website:', error);
      return null;
    }
    
  }
  async update(id: number, data: Language): Promise<Language> {
    throw new Error("not yet implimented");
    
  }
  async find(limit: number, offset: number): Promise<Language[]> {
    throw new Error("not yet implimented");
    
  }
}
