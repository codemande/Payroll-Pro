import Employee from "../models/Employee.model.js";
import { calculatePayroll } from "../utils/payrollCalculator.js";

const getEmployeePayroll = async (req, res) => {

  const employee = await Employee.findById(
    req.params.id
  );

  const payroll = await calculatePayroll(employee);

  res.json(payroll);
}

export { getEmployeePayroll };