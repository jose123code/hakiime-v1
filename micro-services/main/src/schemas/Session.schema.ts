import { Schema } from 'mongoose';
import { ISession } from '../interfaces';


export const sessionSchema: Schema<ISession> = new Schema<ISession>({
  idSession: {
    type: String,
    index: true,
    required: true
  },
  session: {
    type: Schema.Types.Mixed,
    required: true,
  },
  expires: {
    type: Date,
    required:true
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


sessionSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });
