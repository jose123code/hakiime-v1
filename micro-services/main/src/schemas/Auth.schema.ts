import { Schema } from 'mongoose';
import { IAuth } from '../interfaces';


export const authSchema: Schema<IAuth> = new Schema<IAuth>({
  email: {
    type: String,
    required: true,
    index: true
  },
  secreteKey: {
    type: String,
    required: true,
    index: true
  },
  license: {
    type: String,
    required: true,
    index: true
  },
  resetToken:{
    type: String,
    default:"none",
    index:true
  },
  resetExpired:{
    type: Date,
  },
  hits: {
    type: Number,
    default:0
  },
  devices: [{
    type: Schema.Types.ObjectId,
    ref: 'DeviceDetector'
  }],
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

