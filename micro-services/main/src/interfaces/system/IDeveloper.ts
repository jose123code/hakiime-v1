import { Document } from 'mongoose';
import { IApplication } from './IApplication';
import { ILanguage } from './ILanguage';

export interface IDeveloper extends Document {
  name: string;
  email: string;
  phone: number;
  address: string;
  born: string;
  password: string;
  applications: Array<IApplication['_id']>;
  languages: Array<ILanguage['_id']>;
  createdAt: Date;
  updatedAt: Date;
}