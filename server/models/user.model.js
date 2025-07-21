import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    additionalDetails: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
