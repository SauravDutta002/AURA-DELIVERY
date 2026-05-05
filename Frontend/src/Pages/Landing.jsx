import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { FiZap, FiShield, FiMapPin, FiArrowRight } from "react-icons/fi"
import { HiOutlineRocketLaunch } from "react-icons/hi2"
import { MdOutlineDeliveryDining } from "react-icons/md"
import DroneIcon from "../assets/icons/Drone_Icon.png"
import SimulationBadge from "../components/SimulationBadge"
import { BottomNav } from "./Shipments"

const features = [
  {
    icon: FiZap,
    title: "Lightning Fast",
    desc: "5-minute drone delivery",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: FiShield,
    title: "Safe & Secure",
    desc: "GPS-guided autonomous flight",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: FiMapPin,
    title: "Live Tracking",
    desc: "Real-time map & telemetry",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
]

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col overflow-auto relative">
      <SimulationBadge />

      {/* Subtle ambient glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Header ─────────────────────────────────── */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between px-6 py-5 relative z-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-[13px] font-extrabold tracking-tight">A</span>
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-slate-900 tracking-tight leading-none">AURA</h1>
            <p className="text-[8px] font-semibold text-slate-400 uppercase tracking-[0.3em] leading-none mt-0.5">
              Delivery
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-card border border-slate-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">System Online</span>
        </div>
      </motion.nav>

      {/* ── Hero Section ───────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10">
        {/* Drone Animation */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative mb-8"
        >
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 m-auto w-32 h-32 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.img
            src={DroneIcon}
            alt="AURA Drone"
            className="w-28 h-28 object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Delivery by
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"> Drone</span>
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-xs mx-auto leading-relaxed">
            Experience the future of delivery. Autonomous drones bringing your orders in minutes.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/order")}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all group"
        >
          <HiOutlineRocketLaunch size={20} className="text-white" />
          <span className="text-[15px] font-bold text-white">Order Now</span>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <FiArrowRight size={18} className="text-white/70" />
          </motion.div>
        </motion.button>

        {/* Delivery time hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-2 mt-4"
        >
          <MdOutlineDeliveryDining size={14} className="text-slate-300" />
          <span className="text-[11px] text-slate-400 font-medium">Average delivery: ~5 minutes</span>
        </motion.div>
      </div>

      {/* ── Features ───────────────────────────────── */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="px-6 pb-6 relative z-10"
      >
        <div className="grid grid-cols-3 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              className={`flex flex-col items-center gap-2 p-4 ${f.bg} rounded-2xl border ${f.border}`}
            >
              <f.icon size={20} className={f.color} />
              <h4 className="text-[11px] font-bold text-slate-700 text-center">{f.title}</h4>
              <p className="text-[9px] text-slate-400 text-center leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="px-6 pb-20 text-center relative z-10">
        <p className="text-[10px] text-slate-300 font-medium">
          Built with DroneKit + React • Real Hardware Simulation
        </p>
      </div>

      <BottomNav active="home" />
    </div>
  )
}

export default Landing
