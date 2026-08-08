
import { Auth } from "../../../app/entities/Auth";
import { Developer } from "../../../app/entities/Developer";
import { SessionPayload } from "../payloads/IUserPayload";

export interface IAuthInteractor {
  signIn(data: Auth) :Promise<Record<string, any> | null>;
  signOut();
  signUp(data:Developer):Promise<Record<string, any> | null>;
  getAuthEmail(license:string):Promise<string| null>;
  getAuthByToken(token:string):Promise<string| null>;
  forgotPasword(email:string):Promise<string | null>;
  verifyAccount(current:SessionPayload):Promise<void | null>;
  changePassword(current:SessionPayload|string,newPassword:string):Promise<boolean | null>;
}
