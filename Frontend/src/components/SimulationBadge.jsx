import React from "react"
import { motion } from "framer-motion"
import { HiBeaker } from "react-icons/hi2"

const SimulationBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed top-4 right-4 z-[10001] pointer-events-none"
    >
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 backdrop-blur-xl rounded-full border border-amber-200/60">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <HiBeaker size={12} className="text-amber-500" />
        </motion.div>
        <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Simulation</span>
        <motion.div
          className="w-1.5 h-1.5 bg-amber-500 rounded-full"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  )
}

export default SimulationBadge
