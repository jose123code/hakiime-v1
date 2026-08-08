import { Document } from 'mongoose';

export interface IOs extends Document {
  name: string;
  short_name: string;
  version: string;
  platform: string;
  family: string;
  hits: number;
  createdAt: Date;
  updatedAt: Date;
}