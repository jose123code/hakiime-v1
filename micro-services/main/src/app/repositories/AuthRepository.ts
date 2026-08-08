import { inject, injectable } from "inversify";
import { MongoDBManager } from "../../services/mongodb.manager";
import { INTERFACE_TYPE } from "../../utils";
import { Types, Model, Document } from "mongoose";
import {
  IAuthRepository,
  IAuth,
  IDeveloper
} from "../../interfaces";
import { jwtGenerate } from "../../common/jwt";
import forge from 'node-forge';
import EncryptionHelper from "../../common/security";



@injectable()
export class AuthRepository implements IAuthRepository {
  private _db: MongoDBManager;
  private _collection: Model<IAuth, {}, {}, {}, Document<unknown, {}, IAuth> & IAuth & {
    _id: Types.ObjectId;
  }, any>;
  constructor(
    @inject(INTERFACE_TYPE.MongoDBManager) db: MongoDBManager
  ) {
    this._db = db; // Assign the injected MongoDBManager to the class property

  }
  private async authentication(auth: IDeveloper): Promise<Record<string, any> | null> {
    this._collection = this._db.getCollection<IAuth>('Auth');

    try {
      let email = auth.email;

      // Get the Developer collection

      // Check if a Developer with the given URL already exists
      const existingAuth = await this._collection.findOne({ email });
      if (existingAuth) {
        existingAuth.hits = existingAuth.hits + 1;
        existingAuth.save();
        return { secreteKey: existingAuth.secreteKey, license: existingAuth.license };
      }


      // Generate a Triple-DES key with a size of 192 bits (32 bytes)
      const key = forge.random.getBytesSync(32);
      const iv = forge.random.getBytesSync(16);

      // Convert the key to Base64 string for storage/transmission
      const secreteKey = 'HKMSECK-' + EncryptionHelper.cleanKey(forge.util.encode64(key));
      const license = 'HKMIVYS-' + EncryptionHelper.cleanKey(forge.util.encode64(iv));

      // Generate asymmetric key pair
      EncryptionHelper.generateAndSaveKeyPair(secreteKey);
      // Create a new Developer instance
      const newAuth = new this._collection({
        email,
        license,
        secreteKey,
        hits: 1
      });

      // Save the Developer to the database
      await newAuth.save();

      return { license, secreteKey };
    } catch (error) {
      console.error('Error inserting website:', error);
      return null;
    }
  }

  JWTF(auth: IDeveloper): string {
    const userJwt = jwtGenerate(
      {
        verify: true,
        data: {
          userId: auth.id,
          email: auth.email,
          username: auth.name,
          applications: auth.applications,
          expiresAt: ""
        }
      }
    );

    return userJwt;
  }

  async getAuthByLicense(license: string): Promise<(Document<unknown, {}, IAuth> & IAuth & {
    _id: Types.ObjectId;
  }) | null> {
    this._collection = this._db.getCollection<IAuth>('Auth');
    const Auth = await this._collection.findOne({ license });
    return Auth;
  }
  async getAuthByToken(resetToken: string): Promise<(Document<unknown, {}, IAuth> & IAuth & {
    _id: Types.ObjectId;
  }) | null> {
    this._collection = this._db.getCollection<IAuth>('Auth');
    const Auth = await this._collection.findOne({ resetToken });
    return Auth;
  }

  async getAuthByEmail(email: string): Promise<(Document<unknown, {}, IAuth> & IAuth & {
    _id: Types.ObjectId;
  }) | null> {
    this._collection = this._db.getCollection<IAuth>('Auth');
    const Auth = await this._collection.findOne({ email });
    return Auth;
  }
  async signUp(user: IDeveloper): Promise<Record<string, any> | null> {
    return await this.authentication(user);
  }

  async forgetPassword(user: IDeveloper): Promise<Document<unknown, {}, IAuth> & IAuth & {
    _id: Types.ObjectId;
  } | null> {
    var auth = await this.getAuthByEmail(user.email);
    if(auth){
      auth.resetToken = EncryptionHelper.createRandomToken().replace('/','-').replace('=','-');
      auth.resetExpired = new Date(Date.now() + 3600000); // 1 hour
      await auth.save();
      return auth;
    }
     
    return null;
  }

  async signIn(existingUser: IDeveloper): Promise<Record<string, any> | null> {
    return await this.authentication(existingUser);
  }

}
