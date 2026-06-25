import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import Patient from "./models/Patient.js";
import Doctor from "./models/Doctor.js";
import Staff from "./models/Staff.js";
import Appointment from "./models/Appointment.js";

import resourceRoutes from "./routes/resourceRoutes.js";
import { getDashboardStats } from "./controllers/dashboardController.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.get("/", (req, res) => {
  res.send("Saanvi HMS Backend Running");
});

app.get("/api/dashboard/stats", getDashboardStats);

app.use("/api/patients", resourceRoutes(Patient));
app.use("/api/doctors", resourceRoutes(Doctor));
app.use("/api/staff", resourceRoutes(Staff));
app.use("/api/appointments", resourceRoutes(Appointment));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});