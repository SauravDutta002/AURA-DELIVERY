import express from "express"
import DroneStatus from "../models/DroneStatus.js"

const router = express.Router()

/* ================= BOOK DRONE ================= */
router.post("/book/:droneId", async (req,res)=>{
  const { droneId } = req.params

  const doc = await DroneStatus.findOneAndUpdate(
    { droneId },
    { booked:true, confirmed:false, updatedAt:Date.now() },
    { upsert:true, new:true }
  )

  res.json({message:"Drone booked", doc})
})

/* ================= CONFIRM ORDER ================= */
router.post("/confirm/:droneId", async (req,res)=>{
  const { droneId } = req.params

  const doc = await DroneStatus.findOneAndUpdate(
    { droneId },
    { confirmed:true, updatedAt:Date.now() },
    { new:true }
  )

  res.json({message:"Order confirmed", doc})
})

/* ================= RESET ================= */
router.post("/reset/:droneId", async (req,res)=>{
  const { droneId } = req.params

  const doc = await DroneStatus.findOneAndUpdate(
    { droneId },
    { booked:false, confirmed:false, updatedAt:Date.now() },
    { new:true }
  )

  res.json({message:"Reset done", doc})
})

/* ================= GET STATUS (Pi will poll) ================= */
router.get("/:droneId", async (req,res)=>{
  const { droneId } = req.params

  const doc = await DroneStatus.findOne({droneId})

  res.json(doc || {
    droneId,
    booked:false,
    confirmed:false
  })
})

export default router
