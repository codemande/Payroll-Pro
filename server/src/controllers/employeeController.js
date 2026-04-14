import Employee from "../models/Employee.model.js";

const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getEmployees = async (req, res) => {
  const employees = await Employee
    .find()
    .populate("position");

  res.json(employees);
};

const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
};

const deleteEmployee = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  
  res.json({ message: "Employee deleted" });
}

export {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee
}