import { model, Schema } from "mongoose";

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

export const UserModel = model("User", UserSchema);
