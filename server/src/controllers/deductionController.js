import EmployeeDeduction from "../models/EmployeeDeduction.model.js";

/* Add Deduction for a Specific Employee */
const addEmployeeDeduction = async (req, res) => {
  try {
    const { deductionType, percentage, startDate, endDate } = req.body;

    const deduction = await EmployeeDeduction.create({
      employee: req.params.id,
      deductionType,
      percentage,
      startDate,
      endDate
    });

    res.status(201).json(deduction);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to add deduction", 
      error: error.message 
    });
  }
};

/* Get All Deductions for a Specific Employee */
const getEmployeeDeductions = async (req, res) => {
  try{
    const deductions = await EmployeeDeduction.find({
      employee: req.params.id,
    }).populate("deductionType");

    res.json(deductions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch deductions", error });
  }
};

export {
  addEmployeeDeduction,
  getEmployeeDeductions
};