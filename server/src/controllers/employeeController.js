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

export {
  createEmployee,
  getEmployees
}