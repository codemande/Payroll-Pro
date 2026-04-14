import { Schema, model } from "mongoose";

const salaryHistorySchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee"
    },

    previousSalary: Number,

    newSalary: Number,

    effectiveDate: {
      type: Date,
      default: Date.now
    },

    reason: String,
  },
  { timestamps: true }
);

const SalaryHistory = model("SalaryHistory", salaryHistorySchema);
export default SalaryHistory;