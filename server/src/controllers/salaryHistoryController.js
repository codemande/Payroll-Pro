import SalaryHistory from "../models/SalaryHistory.model.js";
import Employee from "../models/Employee.model.js";

/* Create Salary Record */
const addSalaryHistory = async (req, res) => {
  try {
    const { previousSalary, newSalary, effectiveDate, reason } = req.body;
    const employeeId = req.params.id;

    const history = await SalaryHistory.create({
      employee: employeeId,
      previousSalary,
      newSalary,
      effectiveDate,
      reason
    });

    await Employee.findByIdAndUpdate(
      employeeId,
      { baseSalary: newSalary }
    );

    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add Salary History",
      error: error.message
    });
  }
};

/* Get all Salary History */
const getSalaryHistory = async (req, res) => {
  try {
    const history = await SalaryHistory.find({
      employee: req.params.id
    }).sort({ effectiveDate: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Salary History",
      error: error.message
    });
  }
};

/* Update a Salary History */
const updateSalaryHistory = async (req, res) => {
  try {
    const history = await SalaryHistory.findByIdAndUpdate(
      req.params.historyId,
      req.body,
      { new: true }
    );

    if(!history) {
      return res.status(404).json({ message: "Salary history record not found" });
    };

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update Salary History",
      error: error.message
    });
  }
};

export {
  addSalaryHistory,
  getSalaryHistory,
  updateSalaryHistory
};