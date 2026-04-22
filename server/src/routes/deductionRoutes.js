import express from "express";
import { addEmployeeDeduction, getEmployeeDeductions } from "../controllers/deductionController.js";
import admin from "../middleware/adminMiddleware.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", auth, admin, addEmployeeDeduction);
router.get("/", auth, admin, getEmployeeDeductions);

export default router;