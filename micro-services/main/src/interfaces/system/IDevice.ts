import { Document } from 'mongoose';

export interface IDevice extends Document {
  id: string;
  brand: string;
  model_: string;
  type: string;
  code: string;
  trusted: string;
  info: string;
  hits: number;
  createdAt: Date;
  updatedAt: Date;
}