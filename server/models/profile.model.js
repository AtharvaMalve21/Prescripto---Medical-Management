import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    image: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      default: "Not Selected.",
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
