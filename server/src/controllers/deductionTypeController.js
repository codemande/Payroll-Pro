import DeductionType from "../models/DeductionType.model.js";

/* Create Deduction Type */
const createDeductionType = async (req, res) => {
  try {
    const { name, description, defaultPercentage } = req.body;

    const deductionType = await DeductionType.create({
      name,
      description,
      defaultPercentage
    });

    res.status(201).json(deductionType);
  } catch (error) {
    res.status(500).json({ message: "Failed to create deduction type", error });
  }
};

/* Get Deduction Types */
const getDeductionTypes = async (req, res) => {
  try {
    const deductionTypes = await DeductionType.find();

    res.json(deductionTypes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch deduction types", error });
  }
};

export {
  createDeductionType,
  getDeductionTypes
};