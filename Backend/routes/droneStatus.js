import express from "express"
import DroneStatus from "../models/DroneStatus.js"

const router = express.Router()

// 🔹 BOOK DRONE
router.post("/book", async (req, res) => {
  const { droneId } = req.body

  const drone = await DroneStatus.findOneAndUpdate(
    { droneId },
    { booked: true, updatedAt: Date.now() },
    { upsert: true, new: true }
  )

  res.json({ message: "Drone booked", drone })
})

// 🔹 CONFIRM ORDER
router.post("/confirm", async (req, res) => {
  const { droneId } = req.body

  const drone = await DroneStatus.findOneAndUpdate(
    { droneId },
    { confirmed: true, updatedAt: Date.now() },
    { upsert: true, new: true }
  )

  res.json({ message: "Order confirmed", drone })
})

// 🔹 RESET (set both false)
router.post("/reset", async (req, res) => {
  const { droneId } = req.body

  const drone = await DroneStatus.findOneAndUpdate(
    { droneId },
    { booked: false, confirmed: false, updatedAt: Date.now() },
    { upsert: true, new: true }
  )

  res.json({ message: "Reset done", drone })
})

// 🔹 GET STATUS
router.get("/:droneId", async (req, res) => {
  const drone = await DroneStatus.findOne({
    droneId: req.params.droneId
  })

  res.json(drone || {})
})

export default router
