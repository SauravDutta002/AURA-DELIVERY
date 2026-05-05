import React from "react"
import { motion } from "framer-motion"
import { FiCheckCircle, FiPackage, FiNavigation, FiMapPin, FiBox } from "react-icons/fi"

const steps = [
  { id: 1, label: "Order Placed",   icon: FiCheckCircle },
  { id: 2, label: "Drone Assigned", icon: FiPackage },
  { id: 3, label: "Drone En Route", icon: FiNavigation },
  { id: 4, label: "Package Drop",   icon: FiBox },
  { id: 5, label: "Delivered",      icon: FiMapPin },
]

const getActiveStep = (booked, confirmed, progress) => {
  if (!booked) return 0
  if (!confirmed) return 1
  if (progress < 5) return 2
  if (progress < 90) return 3
  if (progress < 100) return 4
  return 5
}

const OrderTimeline = ({ booked, confirmed, progress = 0 }) => {
  const active = getActiveStep(booked, confirmed, progress)

  return (
    <div className="flex items-center w-full gap-0">
      {steps.map((step, i) => {
        const done = i < active
        const current = i === active
        const Icon = step.icon

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: current ? 1.15 : 1,
                  backgroundColor: done ? "#111827" : current ? "rgba(17,24,39,0.1)" : "#f1f5f9",
                  borderColor: done || current ? "#111827" : "#e2e8f0",
                }}
                transition={{ duration: 0.4 }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
              >
                <Icon size={14} className={done ? "text-white" : current ? "text-slate-900" : "text-slate-300"} />
              </motion.div>
              <span className={`text-[8px] font-semibold mt-1.5 text-center leading-tight w-14 ${done || current ? "text-slate-900" : "text-slate-300"}`}>
                {step.label}
              </span>
              {current && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-slate-900"
                  animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-slate-100 relative rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-slate-900 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: done ? "100%" : current ? "50%" : "0%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default OrderTimeline
