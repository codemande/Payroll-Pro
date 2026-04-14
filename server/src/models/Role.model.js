import { Schema, model } from "mongoose";

const roleSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin"
    }
  }
);

const Role = model("Role", roleSchema);
export default Role; 