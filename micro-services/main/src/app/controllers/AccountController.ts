import { NextFunction, Request, Response } from "express";
import {
  IAuthInteractor,
} from "../../interfaces";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import "../../common/auth/local";

// Extend the Request interface to include currentUser property


@injectable()
export class AccountController {
  private interactor: IAuthInteractor;

  constructor(
    @inject(INTERFACE_TYPE.AuthInteractor) interactor: IAuthInteractor
  ) {
    this.interactor = interactor;
  }

  async onAccount(req: Request, res: Response, next: NextFunction) {
    try {
      res.template<any>(null);
    } catch (error) {
      next(error);
    }
  }


}

