import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema({
  droneId: { type: String, required: true },
  lat: Number,
  lon: Number,
  alt: Number,
  speed: Number,
  battery: Number,
  heading: Number,
  timestamp: { type: Date, default: Date.now }
});

telemetrySchema.index({ droneId: 1, timestamp: -1 });

export default mongoose.model("Telemetry", telemetrySchema);
