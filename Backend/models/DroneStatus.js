import mongoose from "mongoose"

const droneStatusSchema = new mongoose.Schema({
  droneId: {
    type: String,
    required: true,
    unique: true
  },

  booked: {
    type: Boolean,
    default: false
  },

  confirmed: {
    type: Boolean,
    default: false
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model("DroneStatus", droneStatusSchema)
