import { Schema, model } from "mongoose";

const positionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    department: {
      type: String,
      default: "General"
    }
  },
  { timestamps: true }
);

const Position = model("Position", positionSchema);
export default Position;