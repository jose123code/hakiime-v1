import { Application } from "../entities/Application";
import { 
  IApplicationInteractor,
  IApplicationRepository,
  IDeveloperInteractor,
  IApplication,
  UserPayload, 
  LicensePayload, 
  SessionPayload,
  IAuthInteractor
 } from "../../interfaces";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { Developer } from "../entities/Developer";
import { Types,Document } from "mongoose";
import { isLicensePayload, isSessionPayload, isUserPayload } from "../../common";

@injectable()
export class ApplicationInteractor implements IApplicationInteractor {
  private repository: IApplicationRepository;
  private _dev_iterator: IDeveloperInteractor;
  private _auth_iterator: IAuthInteractor;

  constructor(
    @inject(INTERFACE_TYPE.ApplicationRepository) repository: IApplicationRepository,
    @inject(INTERFACE_TYPE.DeveloperInteractor) dev_iterator: IDeveloperInteractor,
    @inject(INTERFACE_TYPE.AuthInteractor) auth_interactor: IAuthInteractor,
  ) {
    this.repository = repository;
    this._dev_iterator = dev_iterator;
    this._auth_iterator = auth_interactor;
  }
  async createApplication(data: Application) {
    let respData = await this.repository.create(data);
    // do some checks
    // run broker : notificationService
    return respData;
  }
  // to check if the application is already assigned to the developer
  async isApplicationAssignedToDeveloper(developerId: string, applicationId: string): Promise<boolean> {
    let developer = await this._dev_iterator.getDeveloper(developerId);
    return developer?.applications.includes(applicationId) ?? false;
  }

  // Function to assign an application to a developer
  async assignApplicationToDeveloper(developerId: string, applicationId: string): Promise<void> {
    try {
      // Check if the application is already assigned to the developer
      const isAssigned = await this.isApplicationAssignedToDeveloper(developerId, applicationId);
      if (isAssigned) {
        // console.log('Application is already assigned to the developer');
        return;
      }

      // Find the developer by ID and update their applications array
      await this._dev_iterator.updateApplication(developerId, applicationId);

      // console.log('Application assigned to developer successfully');
    } catch (error) {
      console.error('Error assigning application to developer:', error);
    }
  }

  private async getDevEmail(currentUser: UserPayload|LicensePayload|SessionPayload):Promise<string|null>{
    var email: string|null = null;

    if(isUserPayload(currentUser)){
     email = currentUser.email;
    }

    if(isSessionPayload(currentUser)){
      email = currentUser.email;
    }

    if(isLicensePayload(currentUser)){
      var license = currentUser.auth;
      var authEmail = await this._auth_iterator.getAuthEmail(license);
      if(authEmail){
        email = authEmail;
      }
    }
    return email;
  }

  // Usage example:
  async insertDeveloperAndAssignApplication(app: Application, currentUser: UserPayload|LicensePayload|SessionPayload):Promise<Document<unknown, {}, IApplication> & IApplication & {
    _id: Types.ObjectId;
} | null> {
    var email = await this.getDevEmail(currentUser);
    if(email){
      const dev = await this._dev_iterator.getDeveloperEmail(email);
      if (dev) {
        const newApplication = await this.createApplication(app);
        if(newApplication){
          await this.assignApplicationToDeveloper(dev._id, newApplication._id);
          return newApplication;
        }
      }
    }
    return null;

  }

  
  async getApp(token: string, currentUser: UserPayload|LicensePayload|SessionPayload):Promise<(Document<unknown, {}, IApplication> & IApplication & {
    _id: Types.ObjectId;
  }) | null>{
    var email = await this.getDevEmail(currentUser);
    if(email){
      const dev = await this._dev_iterator.getDeveloperEmail(email);
      if (dev) {
        const application = await this.repository.findAppByToken(token);
        if(application){
          return application;
        }
      }
    }

    return null;
  }

  update(id: number, data: Application) {
    throw new Error("Method not implemented.");
  }
  checkToken(name: string) {
    throw new Error("Method not implemented.");
  }
  getApplications(limit: number, offset: number) {
    throw new Error("Method not implemented.");
  }


}
