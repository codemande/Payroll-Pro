import { Schema, model } from "mongoose";

const deductionTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    defaultPercentage: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const DeductionType = model("DeductionType", deductionTypeSchema);
export default DeductionType;