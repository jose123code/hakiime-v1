import { Document } from 'mongoose';
import { IDeviceDetector } from './interactors/IDeviceDetector';

export interface IAuth extends Document {
  email: string;
  secreteKey: string;
  license: string;
  hits: number;
  devices: Array<IDeviceDetector['_id']>;
  createdAt: Date;
  updatedAt: Date;
  resetToken?:string
  resetExpired?:Date,
}