import Employee from "../models/Employee.model.js";

/* Create Employee */
const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json(error);
  }
};

/* Get all Employee */
const getEmployees = async (req, res) => {
  const employees = await Employee
    .find()
    .populate("position");

  res.json(employees);
};

/* Get Specific Employee */
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee
      .findById(req.params.id)
      .populate("position");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json(error);
  }
};

/* Update Employee */
const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(employee);
};

/* Delete Employee */
const deleteEmployee = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  
  res.json({ message: "Employee deleted" });
}

export {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
}