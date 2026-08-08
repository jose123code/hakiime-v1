import { IApplication } from "../IApplication";
import { Types, Document } from "mongoose";
import { LicensePayload, SessionPayload, UserPayload } from "../payloads/IUserPayload";
import { Application } from "../../../app/entities/Application";


export interface IApplicationInteractor {
  createApplication(data: Application);
  update(id: number, data: Application);
  checkToken(name: string);
  getApplications(limit: number, offset: number);
  isApplicationAssignedToDeveloper(developerId: string, applicationId: string): Promise<boolean>;
  assignApplicationToDeveloper(developerId: string, applicationId: string): Promise<void>;
  insertDeveloperAndAssignApplication(app: Application, currentUser: UserPayload|LicensePayload|SessionPayload):Promise<Document<unknown, {}, IApplication> & IApplication & {
      _id: Types.ObjectId;
  } | null>;
  getApp(token: string, currentUser: UserPayload|LicensePayload|SessionPayload):Promise<(Document<unknown, {}, IApplication> & IApplication & {
    _id: Types.ObjectId;
  }) | null>;
}
