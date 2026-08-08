import { Schema } from 'mongoose';
import { IDeveloper } from '../interfaces';
import { Password } from '../common';


export const developerSchema: Schema<IDeveloper> = new Schema<IDeveloper>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  phone: {
    type: Number,
    unique: false,
    index: true,
    default: 0
  },
  address:{
    type: String,
    default: "",
  },
  born:{
    type: String,
    default: "",
  },
  password:{
    type: String,
    required: true,
  },
  applications: [{
    type: Schema.Types.ObjectId,
    ref: 'Application'
  }],

  languages: [{
    type: Schema.Types.ObjectId,
    ref: 'Languages'
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
      delete ret.password;
      delete ret.__v;
    },
  },
});


developerSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
