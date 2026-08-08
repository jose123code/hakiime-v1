import { Schema } from 'mongoose';
import { IOs } from '../interfaces';


export const osSchema: Schema<IOs> = new Schema<IOs>({
  name: {
    type: String,
    index: true,
    required: true
  },
  short_name: {
    type: String,
    required: true,
    index: true
  },
  version: {
    type: String,
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: true,
    index: true
  },
  family: {
    type: String,
    required: true,
    index: true
  },
  hits: {
    type: Number,
    default:0
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
    index: true
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
    index: true
  }
},
{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
});

