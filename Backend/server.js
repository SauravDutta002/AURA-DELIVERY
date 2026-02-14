import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import telemetryRoutes from "./routes/telemetry.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Mongo connect
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected ✅");

// ROOT ROUTE (PUT THIS EARLY)
app.get("/", (req, res) => {
  res.send("Drone Telemetry API Running 🚁");
});

// Telemetry routes
app.use("/telemetry", telemetryRoutes);

// 404 handler (ALWAYS LAST)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
