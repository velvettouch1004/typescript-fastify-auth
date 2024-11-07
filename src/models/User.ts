import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user";

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscribed: { type: Boolean, default: false },
    update: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
