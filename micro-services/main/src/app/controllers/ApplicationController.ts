import { NextFunction, Request, Response } from "express";
import { IApplicationInteractor } from "../../interfaces";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE, generateUniqueToken } from "../../utils";
import { Application } from "../entities/Application";
import { Developer } from "../entities/Developer";

@injectable()
export class ApplicationController {
  private interactor: IApplicationInteractor;

  constructor(
    @inject(INTERFACE_TYPE.ApplicationInteractor) interactor: IApplicationInteractor
  ) {
    this.interactor = interactor;
  }

  async onCreateApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { appName, appURL, appCallback } = req.body;
      const input:Application = {
        name: appName,
        url:appURL,
        callback:appCallback,
        description: "none",
        token: generateUniqueToken(32)
      };
      
      if(req.currentUser){
        const data = await this.interactor.insertDeveloperAndAssignApplication(input,req.currentUser);
        if(data != null) {
          return res.success<Record<string,any>>({
              name: data.name,
              applicationCode: data.token
          });
        }     
      }
      
      return res.error<string>('Something went wrong1',400);
    } catch (error) {
      
      next(error);
    }
  }

  async onViewApplication (req:Request, res:Response, next:NextFunction){
    try {
      if(req.currentUser){
        const apptoken = req.params.apptoken;
        var data = await this.interactor.getApp(apptoken,req.currentUser);
        if(data != null) {
          return res.success<Record<string,any>>({
              name: data.name,
              applicationCode: data.token,
              url: data.url,
              description: data.description,
              callback_url: data.callbackUrl,
              calls: data.calls,
              created_at:data.createdAt
          });
        } 
      }
      return res.error<string>('Something went wrong',400);

    } catch (error) {
      next(error);
    }
  }
  async onGetApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const offset = parseInt(`${req.query.offset}`) || 0;
      const limit = parseInt(`${req.query.limit}`) || 10;

      const data = await this.interactor.getApplications(limit, offset);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async onUpdateApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const stock = req.body.stock;

      const data = await this.interactor.update(id, stock);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
