import express from "express";
import { createEmployee, getEmployees, updateEmployee, deleteEmployee } from "../controllers/employeeController.js";
import admin from "../middleware/adminMiddleware.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, admin, createEmployee);

router.get("/", auth, admin, getEmployees);

router.put("/:id", auth, admin, updateEmployee );

router.delete("/:id", auth, admin, deleteEmployee );

export default router;