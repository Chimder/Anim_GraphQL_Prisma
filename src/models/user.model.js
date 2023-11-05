import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  favorite: [String],
  picture: String,
  local: String,
  lastRead: {
    type: Schema.Types.Array,
    ref: "lastRead",
  },
});

const UserLastReadSchema = new Schema({
  name: String,
  chapter: Number,
});
const UserLastRead = model("lastRead", UserLastReadSchema);
const UserModel = model("users", UserSchema);
export default UserModel;
