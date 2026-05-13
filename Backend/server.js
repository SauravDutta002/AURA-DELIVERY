import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import telemetryRoutes from "./routes/telemetry.js";
import droneStatusRoutes from "./routes/droneStatus.js"


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected ✅");

// Root
app.get("/", (req, res) => {
  res.send("Drone Telemetry API UPDATED");
});

// Health check for Cron jobs (Render keep-alive)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Telemetry routes
app.use("/telemetry", telemetryRoutes);

app.use("/drone", droneStatusRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
