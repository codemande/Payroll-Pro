import { Schema, model } from "mongoose";
import Position from "./Position.model";

const employeeSchema = new Schema(
  {
    employeeNumber: {
      type: String,
      required: true,
      unique: true
    },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    position: {
      type: Schema.Types.ObjectId,
      ref: Position
    },
    hireDate: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    baseSalary: {
      type: Number,
      default: 0
    },
    taxRate: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Employee = model("Employee", employeeSchema);
export default Employee;