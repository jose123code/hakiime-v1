import { Types,Document } from "mongoose";
import { IDeveloper } from "../IDeveloper";
import { Developer } from "../../../app/entities/Developer";

export interface IDeveloperRepository {
  create(data: Developer): Promise<Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
} | null>;
  update(doc:Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }):Promise<void>;
  find(limit: number, offset: number): Promise<Developer[]>;
  updateApplication(id:string,applicationId:string): Promise<void>;
  findDeveloper(developerId: string): Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null>;
  findDeveloperEmail(developerEmail: string): Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null>;
  findDeveloperPhone(developerPhone: number): Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null>;
}
