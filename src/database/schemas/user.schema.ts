import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date, required: false },
    address: { type: String, required: false, nullable: true },
    phone: { type: String, required: false, nullable: true },
    status: { type: String, required: false, nullable: true },
  },
  { timestamps: true },
);
