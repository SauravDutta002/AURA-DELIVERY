import React from "react"
import { motion } from "framer-motion"
import { MdSpeed, MdHeight, MdGpsFixed, MdTimer } from "react-icons/md"

const StatsBar = ({ progress = 0 }) => {
  const speed = progress > 5 && progress < 95 ? (12 + Math.random() * 6).toFixed(1) : "0.0"
  const altitude = progress > 5 && progress < 95 ? "5.0" : progress >= 95 ? "2.0" : "0.0"
  const eta = progress < 95 ? Math.max(1, Math.ceil((100 - progress) * 0.15)) : 0
  const distance = (Math.max(0, (100 - progress) * 2.8)).toFixed(0)

  const stats = [
    { icon: MdSpeed,    label: "Speed",    value: speed,                     unit: "m/s",  color: "text-amber-500" },
    { icon: MdHeight,   label: "Altitude", value: altitude,                  unit: "m",    color: "text-emerald-500" },
    { icon: MdGpsFixed, label: "Distance", value: distance,                  unit: "m",    color: "text-indigo-500" },
    { icon: MdTimer,    label: "ETA",      value: eta > 0 ? `${eta}` : "—",  unit: eta > 0 ? "min" : "", color: "text-rose-500" },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex flex-col items-center gap-1 py-2.5 px-1 bg-slate-50/80 rounded-xl border border-slate-100/60"
        >
          <s.icon size={16} className={s.color} />
          <div className="flex items-baseline gap-0.5">
            <span className="text-[14px] font-bold text-slate-900 tabular-nums">{s.value}</span>
            <span className="text-[8px] text-slate-400 font-medium">{s.unit}</span>
          </div>
          <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider">{s.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsBar
