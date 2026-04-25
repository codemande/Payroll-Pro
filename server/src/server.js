import 'dotenv/config'
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import deductionTypeRoute from "./routes/deductionTypeRoutes.js";

// Initialize express app
const app = express();

const PORT = process.env.PORT || 8000

// Connect to MongoDB database
connectDB();

// Cors configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(cookieParser());

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/deduction-types", deductionTypeRoute);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));