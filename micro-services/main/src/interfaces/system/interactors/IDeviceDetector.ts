import { Document } from 'mongoose';
import { IOs } from '../IOs';
import { IDevice } from '../IDevice';
import { IClient } from '../IClient';

export interface IDeviceDetector extends Document {
  os: Array<IOs['_id']>;
  device: Array<IDevice['_id']>;
  client: Array<IClient['_id']>;
  createdAt: Date;
  updatedAt: Date;
}