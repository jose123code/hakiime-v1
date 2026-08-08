import { Schema } from 'mongoose';
import { IDevice } from '../interfaces';


export const deviceSchema: Schema<IDevice> = new Schema<IDevice>({
  id: {
    type: String,
    index: true,
    required: true
  },
  brand: {
    type: String,
    required: true,
    index: true
  },
  model_: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    index: true
  },
  trusted: {
    type: String,
    required: true,
    index: true
  },
  info: {
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

