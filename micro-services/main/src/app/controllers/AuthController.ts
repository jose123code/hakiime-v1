import { NextFunction, Request, Response } from "express";
import {
  IAuthInteractor,
  LicensePayload,
  SessionPayload,
  UserPayload
} from "../../interfaces";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { Developer } from "../entities/Developer";
import { Auth } from "../entities/Auth";
import "../../common/auth/local";
import passport from "passport";
import { IVerifyOptions } from "passport-local";
import { BadRequestError } from "../../common";
// Extend the Request interface to include currentUser property


@injectable()
export class AuthController {
  private interactor: IAuthInteractor;

  constructor(
    @inject(INTERFACE_TYPE.AuthInteractor) interactor: IAuthInteractor
  ) {
    this.interactor = interactor;
  }

  async onCreateAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { developerName, developerEmail, developerPassword } = req.body;
      var developerPhone = 0;

      if ('developerPhone' in req.body) {
        developerPhone = req.body.developerPhone;
      }
      const devInput: Developer = {
        email: developerEmail,
        name: developerName,
        phone: developerPhone,
        password: developerPassword
      }
      // validate logic
      const data = await this.interactor.signUp(devInput);

      if (data == null) {
        return res.error<string>('Something went wrong', 400);
      } else {
        if (req.isMain) {
          req.logIn({ current: { auth: data.license } }, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/");
          });
        }

        return res.success<Record<string, any>>(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async onAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const auth: Auth = {
        email: email,
        password: password
      }

      if (req.isMain) {
        return passport.authenticate("local", (err: Error, user: LicensePayload, info: IVerifyOptions) => {
          if (err) { return next(err); }
          if (!user) {
            req.flash("errors", { msg: info.message });
            return res.redirect("/" + req.template!);
          }
          req.logIn({ current: user }, (err) => {
            if (err) { return next(err); }
            req.flash("success", { msg: "Success! You are logged in." });
            var returnTo = "/";
            if (req.session.returnTo !== undefined) returnTo = req.session.returnTo;

            console.log("return to " + returnTo + ".....");

            return res.redirect(returnTo);
          });
        })(req, res, next);
      }
      // validate logic
      const data = await this.interactor.signIn(auth);

      if (data == null) {
        return res.error<string>('Something went wrong', 400);
      } else {
        if ('error' in data) {
          throw new BadRequestError(data.error);
        }
        return res.success<Record<string, any>>(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async onAuthPassport(email: string, password: string, done: any): Promise<any> {
    const auth: Auth = {
      email: email,
      password: password
    }
    // validate logic
    const data = await this.interactor.signIn(auth);
    if (data == null) {
      return done(undefined, false, { message: `Invalid email or password.` });
    } else {
      if ('error' in data) {
        return done(undefined, false, { message: data.error });
      }
      return done(undefined, { auth: data.license });
    }
  }

  async onDeserializeAuth(license: string, done: any): Promise<any> {

    // validate logic
    const data = await this.interactor.getAuthEmail(license);
    if (data == null) {
      throw new BadRequestError('Invalid session.' + license);
    } else {
      return done(undefined, { auth: license });
    }
  }

  async onAuthorization(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, authorization } = req.body;
      const auth: Auth = {
        email: email,
        password: authorization
      }
      // validate logic
      const data = await this.interactor.signIn(auth);

      if (data == null) {
        return res.error<string>('Something went wrong', 400);
      } else {
        if ('error' in data) {
          return res.error<any>(data.error, 200);
        }
        
        return res.success<Record<string, any>>(data);
      }
    } catch (error) {
      next(error);
    } 
  }

  async onAuthForgot(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      // validate logic
      const data = await this.interactor.forgotPasword(email);

      if (data == null) {
        return res.error<string>('Something went wrong', 400);
      } else {
        req.flash("info",{msg:`An e-mail has been sent to ${email} with further instructions.`});
        return res.redirect("/"+req.template!);
      }
    } catch (error) {
      next(error);
    }
  }

  

  async onVerifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      var currentUser = req.currentUser as SessionPayload;

      // validate logic
      const data = await this.interactor.verifyAccount(currentUser);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async onResetPasswordGet(req: Request, res: Response, next: NextFunction) {

    if (req.isAuthenticated()) {
        return res.redirect("/");
    }

    var token = req.params.token;
    var emailDev = await this.interactor.getAuthByToken(token);

      if(emailDev){
        req.template = "auth/reset-password"

        return res.template<any>({token});
      }
    req.flash('errors',[{msg:"Password reset token is invalid or has expired."}])
    return res.redirect("/auth/login");
  }

  async onResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { newPassword } = req.body;
      var token = req.params.token;

      var emailDev = await this.interactor.getAuthByToken(token);

      if(emailDev){
        // validate logic
        const data = await this.interactor.changePassword(emailDev, newPassword);
        if(data){
         return res.redirect("/auth/login");
        }
      }
      
      req.flash('errors',[ { msg: "Password reset token is invalid or has expired." }])
      res.redirect("/"+req.template!)
    } catch (error) {
      req.flash('errors',[ { msg: "Password reset token is invalid or has expired." }])
      res.redirect("/"+req.template!)
    }
  }
  async VerifyToken(token:string) {
    // try {

    //   // validate logic
    //   const data = await this.interactor.verifyAccount(currentUser);

    //   return res.status(200).json(data);
    // } catch (error) {
    //   next(error);
    // }
  }


}

