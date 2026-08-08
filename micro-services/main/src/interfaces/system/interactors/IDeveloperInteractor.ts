import { Types, Document } from "mongoose";
import { IDeveloper } from "../IDeveloper";
import { Developer } from "../../../app/entities/Developer";

export interface IDeveloperInteractor {
  createDeveloper(data: Developer):Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null>;
  update(id: number, data: Developer);
  checkToken(name: string);
  getDeveloper(developerId:string):Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null>;
  getDeveloperEmail(developerEmail:string):Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null>;
  getDeveloperPhone(developerPhone:number):Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null>;
  updateDeveloper(doc:Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }):Promise<void>;
  updateApplication(id:string,applicationId:string): Promise<void>;
  getDevelopers(limit: number, offset: number);
}
