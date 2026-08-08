import { Application } from "../../../app/entities/Application";
import { IApplication } from "../IApplication";
import { Types, Document } from "mongoose";


export interface IApplicationRepository {
  create(data: Application): Promise<Document<unknown, {}, IApplication> & IApplication & {
    _id: Types.ObjectId;
} | null>;
  update(id: number, data: Application): Promise<Application>;
  findAppByToken(token: string): Promise<(Document<unknown, {}, IApplication> & IApplication & {
    _id: Types.ObjectId;
  }) | null>;
  findApplication(id: string): Promise<(Document<unknown, {}, IApplication> & IApplication & {
    _id: Types.ObjectId;
  }) | null>;
}
