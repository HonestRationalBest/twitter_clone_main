import { model, Schema } from "mongoose";

export interface UserModelInterface {
  _id?: string;
  email: string;
  fullname: string;
  username: string;
  password?: string;
  confirmed_hash?: string;
  confirmed: Boolean;
  location?: string;
  about?: string;
  website?: string;
}

const UserSchema = new Schema({
  email: {
    unique: true,
    require: true,
    type: String,
  },
  fullname: {
    require: true,
    type: String,
  },
  username: {
    unique: true,
    require: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
  confirmed_hash: {
    require: true,
    type: String,
  },
  confirmed: { type: Boolean, default: false },
  location: String,
  about: String,
  website: String,
});

UserSchema.set("toJSON", function (_: any, obj: UserModelInterface) {
  delete obj.password;
  delete obj.confirmed_hash;
  return obj;
});

export const UserModel = model("User", UserSchema);
