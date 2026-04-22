import express from "express";
import { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee } from "../controllers/employeeController.js";
import admin from "../middleware/adminMiddleware.js";
import auth from "../middleware/authMiddleware.js";
import deductionRoutes from "./deductionRoutes.js";

const router = express.Router();

router.post("/", auth, admin, createEmployee);

router.get("/", auth, admin, getEmployees);

router.get("/:id", auth, admin, getEmployeeById);

router.put("/:id", auth, admin, updateEmployee );

router.delete("/:id", auth, admin, deleteEmployee );

router.use("/:id/deductions", deductionRoutes);

export default router;