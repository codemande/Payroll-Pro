import 'dotenv/config'
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js"

// Initialize express app
const app = express();

const PORT = process.env.PORT || 8000

// Connect to MongoDB database
connectDB();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(cookieParser());

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/payroll", payrollRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));