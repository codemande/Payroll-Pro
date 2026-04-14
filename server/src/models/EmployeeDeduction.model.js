import { Schema, model } from "mongoose";

const employeeDeductionSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee"
    },

    deductionType: {
      type: Schema.Types.ObjectId,
      ref: "DeductionType"
    },

    percentage: Number,

    startDate: {
      type: Date,
      default: Date.now()
    },

    endDate: Date,

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const EmployeeDeduction = model("EmployeeDeduction", employeeDeductionSchema);
export default EmployeeDeduction;