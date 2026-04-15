import express from "express";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import { getEmployeePayroll } from "../controllers/payrollController.js"

const router = express.Router();

router.get("/:id", auth, admin, getEmployeePayroll);

export default router;