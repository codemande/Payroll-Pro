import 'dotenv/config'
import express from "express";
import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000

connectDB();

app.use(express.json());

app.use("/api/employees", employeeRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));