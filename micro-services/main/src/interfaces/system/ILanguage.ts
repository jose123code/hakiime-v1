import { Document } from 'mongoose';

export interface ILanguage extends Document {
    name: string;
    abbr: string;
    url: string;
    devs: number;
    createdAt: Date;
    updatedAt: Date;
  }