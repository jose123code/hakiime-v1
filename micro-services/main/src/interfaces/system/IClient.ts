import { Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  short_name: string;
  version: string;
  type: string;
  engine: string;
  engine_version: string;
  family: string;
  hits: number;
  createdAt: Date;
  updatedAt: Date;
}