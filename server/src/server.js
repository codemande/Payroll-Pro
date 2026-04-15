import 'dotenv/config'
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js"

const app = express();
const PORT = process.env.PORT || 5000

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/payroll", payrollRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));