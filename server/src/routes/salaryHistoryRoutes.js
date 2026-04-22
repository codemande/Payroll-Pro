import express from "express";
import { addSalaryHistory, getSalaryHistory, updateSalaryHistory } from "../controllers/salaryHistoryController.js";
import admin from "../middleware/adminMiddleware.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", auth, admin, addSalaryHistory);
router.get("/", auth, admin, getSalaryHistory);
router.put("/:historyId", auth, admin, updateSalaryHistory);

export default router;