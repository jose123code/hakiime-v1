import { Document } from 'mongoose';

export interface ISession extends Document {
    idSession: string;
    session: any;
    expires: Date;
    createdAt: Date;
    updatedAt: Date;
  }