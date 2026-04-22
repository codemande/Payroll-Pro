import express from "express";
import { createDeductionType, getDeductionTypes } from "../controllers/deductionTypeController.js";
import admin from "../middleware/adminMiddleware.js";
import auth from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", auth, admin, createDeductionType);
router.get("/", auth, admin, getDeductionTypes);

export default router;