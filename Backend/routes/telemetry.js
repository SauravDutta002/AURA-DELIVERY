import express from "express";
import Telemetry from "../models/Telemetry.js";

const router = express.Router();

const API_KEY = process.env.API_KEY;

// 🔐 API KEY MIDDLEWARE
router.use((req, res, next) => {
  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});


// 📡 POST TELEMETRY (Pi sends)
router.post("/", async (req, res) => {
  try {
    const { droneId, lat, lon, alt } = req.body;

    if (!droneId) {
      return res.status(400).json({ error: "droneId required" });
    }

    const updated = await Telemetry.findOneAndUpdate(
      { droneId: droneId },   // find existing drone

      {
        lat: lat,
        lon: lon,
        alt: alt,
        timestamp: new Date()
      },
      {
        new: true,
        upsert: true           // create if not exists
      }
    );

    res.json({ status: "updated", data: updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// 🛰️ GET FULL ROUTE
router.get("/route/:droneId", async (req, res) => {
  const data = await Telemetry
    .find({ droneId: req.params.droneId })
    .sort({ timestamp: 1 });

  res.json(data);
});


// 📍 GET LATEST LOCATION
router.get("/latest/:droneId", async (req, res) => {
  const data = await Telemetry
    .findOne({ droneId: req.params.droneId })
    .sort({ timestamp: -1 });

  res.json(data);
});

export default router;
