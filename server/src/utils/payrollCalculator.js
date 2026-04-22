import EmployeeDeduction from "../models/EmployeeDeduction.model.js";

const calculatePayroll = async (employee) => {

  let baseSalary = employee.baseSalary;

  let tax = (baseSalary * employee.taxRate) / 100;

  const deductions = await EmployeeDeduction.find({
    employee: employee._id,
    isActive: true
  });

  let deductionTotal = 0;

  deductions.forEach(d => {
    deductionTotal += (baseSalary * d.percentage) / 100;
  });

  const netSalary = baseSalary - tax - deductionTotal;

  return{
    baseSalary,
    tax,
    deductions: deductionTotal,
    netSalary,
  }
};

export { calculatePayroll }