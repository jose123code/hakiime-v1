import { Schema } from 'mongoose';
import { IApplication } from '../interfaces';


export const applicationSchema: Schema<IApplication> = new Schema<IApplication>({
  name: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
  },
  callbackUrl: {
    type: String,
    required: true
  },
  calls: {
    type: Number,
    default: 0,
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

