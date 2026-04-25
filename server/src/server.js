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

const allowedOrigins = [
  "http://localhost:5173",                  
  "https://payroll-pro-lilac.vercel.app" 
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
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
app.use("/api/deduction-types", deductionTypeRoute);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));