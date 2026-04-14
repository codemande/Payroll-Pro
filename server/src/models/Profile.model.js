import { Schema, model } from "mongoose";

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      default: "",
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

const Profile = model("Profile", profileSchema);
export default Profile;