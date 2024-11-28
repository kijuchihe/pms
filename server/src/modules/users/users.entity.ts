import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'viewer', enum: ['member', 'admin', 'viewer'] },
}, { timestamps: true });

export const UserModel = model('User', UserSchema);