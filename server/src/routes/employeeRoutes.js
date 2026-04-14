import express from "express";
import { createEmployee, getEmployees } from "../controllers/employeeController.js";
import isAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", isAdmin, createEmployee);

router.get("/", isAdmin, getEmployees);

export default router;