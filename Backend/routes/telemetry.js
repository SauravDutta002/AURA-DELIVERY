import express from "express";
import Telemetry from "../models/Telemetry.js";

const router = express.Router();

const API_KEY = process.env.API_KEY;

// AUTH middleware
router.use((req, res, next) => {
  if (req.headers["x-api-key"] !== API_KEY)
    return res.status(401).json({ error: "Unauthorized" });
  next();
});

// POST telemetry
router.post("/", async (req, res) => {
  const data = await Telemetry.create(req.body);
  res.json({ status: "saved", id: data._id });
});

// GET latest
router.get("/latest/:droneId", async (req, res) => {
  const data = await Telemetry
    .findOne({ droneId: req.params.droneId })
    .sort({ timestamp: -1 });

  res.json(data);
});

// GET route
router.get("/route/:droneId", async (req, res) => {
  const data = await Telemetry
    .find({ droneId: req.params.droneId })
    .sort({ timestamp: -1 })
    .limit(1000);

  res.json(data);
});

export default router;
