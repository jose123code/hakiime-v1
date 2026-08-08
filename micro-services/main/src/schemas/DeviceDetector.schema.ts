import { Schema } from 'mongoose';
import { IDeviceDetector } from '../interfaces';


export const deviceDetectorSchema: Schema<IDeviceDetector> = new Schema<IDeviceDetector>({
  os: [{
    type: Schema.Types.ObjectId,
    ref: 'Os'
  }],
  device: [{
    type: Schema.Types.ObjectId,
    ref: 'Device'
  }],
  client: [{
    type: Schema.Types.ObjectId,
    ref: 'Client'
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

