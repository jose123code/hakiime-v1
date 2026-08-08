import { Document } from 'mongoose';

export interface IApplication extends Document {
    name: string;
    token: string;
    url: string;
    description: string;
    callbackUrl: string;
    calls: number;
    createdAt: Date;
    updatedAt: Date;
  }