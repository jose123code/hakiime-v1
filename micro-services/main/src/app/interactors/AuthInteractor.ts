import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { Developer } from "../entities/Developer";
import { Types, Document } from "mongoose";

import {
  IDeveloperInteractor,
  IAuthInteractor,
  IAuthRepository,
  SessionPayload,
  IDeveloper
} from "../../interfaces";
import { Auth } from "../entities/Auth";
import { BadRequestError, Password, isSessionPayload } from "../../common";


@injectable()
export class AuthInteractor implements IAuthInteractor {
  private repository: IAuthRepository;
  private _dev_iterator: IDeveloperInteractor;

  constructor(
    @inject(INTERFACE_TYPE.AuthRepository) repository: IAuthRepository,
    @inject(INTERFACE_TYPE.DeveloperInteractor) dev_iterator: IDeveloperInteractor,
  ) {
    this.repository = repository;
    this._dev_iterator = dev_iterator;
  }
  async signIn(data: Auth): Promise<Record<string, any> | null> {

    let email = data.email;
    let password = data.password;
    const existingUser = await this._dev_iterator.getDeveloperEmail(email);
    if (!existingUser) {
      return { error: `Email ${email} not found.` }
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      var auth = await this.repository.getAuthByLicense(password);
      if (!auth) {
        return { error: "Invalid email or password." }
      }
      return await this.repository.signIn(existingUser);
    }

    return await this.repository.signIn(existingUser);

  }

  signOut() {
    throw new Error("Method not implemented.");
  }

  async signUp(data: Developer): Promise<Record<string, any> | null> {
    const user = await this._dev_iterator.createDeveloper(data);
    if (!user) {
      throw new BadRequestError('Email does not exist');
    }

    return await this.repository.signIn(user);
  }

  async getAuthEmail(license: string): Promise<string | null> {
    var auth = await this.repository.getAuthByLicense(license);
    if (auth) {
      auth.hits = auth.hits + 1;
      await auth.save();
      return auth.email;
    }

    return null;
  }

  async getAuthByToken(token: string): Promise<string | null> {
    var auth = await this.repository.getAuthByToken(token);
    if (auth) {
      auth.hits = auth.hits + 1;
      await auth.save();
      if(new Date() < auth.resetExpired!){
        return auth.email
      }
    }

    return null;
  }

  async forgotPasword(email: string): Promise<string | null> {
    const user = await this._dev_iterator.getDeveloperEmail(email);

    if (user) {
      var auth = await this.repository.forgetPassword(user);
      if(auth){
        return auth.resetToken!
      }
    }
    throw new BadRequestError('User with Email does not exist');
  }

  async changePassword(current: SessionPayload|string, newPassword: string): Promise<boolean | null> {

    var user:(Document<unknown, {}, IDeveloper> & IDeveloper & {
      _id: Types.ObjectId;
    }) | null = null;
    
    if(isSessionPayload(current)){
       user = await this._dev_iterator.getDeveloper(current.userId);
    }else{
       user = await this._dev_iterator.getDeveloperEmail(current);
    }

    if (user) {
      user.password = newPassword;
      this._dev_iterator.updateDeveloper(user);

      return true;
      // return user;
    }
    throw new BadRequestError('User does not exist');
  }

  async verifyAccount(current: SessionPayload): Promise<void | null> {
    const user = await this._dev_iterator.getDeveloper(current.userId);

    if (user) {


      // return user;
    }
    throw new BadRequestError('User does not exist');
  }

  async assignUserLoginStatus(data: Developer) {
    // let respData = await this.repository.create(data);
    // do some checks
    // run broker : notificationService
    // return respData;
  }

}
