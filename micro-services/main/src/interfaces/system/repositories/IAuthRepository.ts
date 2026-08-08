import { Auth } from "../../../app/entities/Auth";
import { Developer } from "../../../app/entities/Developer";
import { IAuth } from "../IAuth";
import { IDeveloper } from "../IDeveloper";
import { Types,Document } from "mongoose";


export interface IAuthRepository {
  signIn(data: Auth): Promise<Record<string,any>|null>;
  signUp(data: Developer): Promise<Record<string,any>|null>;
  forgetPassword(user: IDeveloper): Promise<Document<unknown, {}, IAuth> & IAuth & {
    _id: Types.ObjectId;
  } | null> ;
  getAuthByLicense(license:string):Promise<(Document<unknown, {}, IAuth> & IAuth & {
    _id: Types.ObjectId;
  }) | null>;
  getAuthByToken(resetToken:string):Promise<(Document<unknown, {}, IAuth> & IAuth & {
    _id: Types.ObjectId;
  }) | null>;
}
