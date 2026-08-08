import { Schema } from 'mongoose';
import { ILanguage } from '../interfaces';


export const languageSchema: Schema<ILanguage> = new Schema<ILanguage>({
  name: {
    type: String,
    required: true,
    unique:true,
    index: true
  },
  abbr: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  devs: {
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

