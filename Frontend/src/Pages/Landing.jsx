import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { FiZap, FiShield, FiMapPin, FiArrowRight, FiActivity, FiHeart } from "react-icons/fi"
import { FaBriefcaseMedical, FaHeartbeat, FaRocket } from "react-icons/fa"
import { GiRadarSweep, GiDefibrilate } from "react-icons/gi"
import { TbFirstAidKit } from "react-icons/tb"
import DroneIcon from "../assets/icons/Drone_Icon.png"
import SimulationBadge from "../components/SimulationBadge"
import { BottomNav } from "./Shipments"

const features = [
  {
    icon: GiRadarSweep,
    title: "AI Victim Scan",
    desc: "Thermal & optical person detection",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  {
    icon: TbFirstAidKit,
    title: "Medical Aid Drop",
    desc: "Autonomous tether winch release",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: FiMapPin,
    title: "Live GPS Telemetry",
    desc: "Real-time altitude & FLIR tracking",
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
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Header ─────────────────────────────────── */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between px-6 py-5 relative z-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30 text-white border border-red-500">
            <FaBriefcaseMedical size={16} />
          </div>
          <div>
            <h1 className="text-[16px] font-black text-slate-900 tracking-tight leading-none">AURA <span className="text-red-600">MED-SAR</span></h1>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.25em] leading-none mt-1">
              Search & Rescue
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Fleet Standby</span>
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
            className="absolute inset-0 m-auto w-36 h-36 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.img
            src={DroneIcon}
            alt="AURA Med-Drone"
            className="w-32 h-32 object-contain relative z-10 drop-shadow-[0_12px_35px_rgba(239,68,68,0.25)]"
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            Autonomous Emergency Response
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Search, Locate &
            <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent"> Deliver Aid</span>
          </h2>
          <p className="text-sm text-slate-500 mt-3 max-w-xs mx-auto leading-relaxed font-medium">
            AI thermal computer vision locates victims in distress and deploys emergency trauma kits via precision tether winch.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/order")}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 rounded-2xl shadow-[0_10px_35px_rgba(239,68,68,0.35)] transition-all group"
        >
          <FaRocket size={18} className="text-white" />
          <span className="text-[14px] font-black uppercase tracking-wider text-white">Initiate SAR Mission</span>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <FiArrowRight size={18} className="text-white/80" />
          </motion.div>
        </motion.button>

        {/* Rapid response time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-2 mt-4"
        >
          <FiActivity size={14} className="text-red-500" />
          <span className="text-[11px] text-slate-400 font-bold">Rapid Air Response: ~3 min to target grid</span>
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
              className={`flex flex-col items-center gap-2 p-4 ${f.bg} rounded-2xl border ${f.border} shadow-sm`}
            >
              <f.icon size={22} className={f.color} />
              <h4 className="text-[11px] font-black text-slate-800 text-center">{f.title}</h4>
              <p className="text-[9px] text-slate-500 text-center leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="px-6 pb-20 text-center relative z-10">
        <p className="text-[10px] text-slate-400 font-bold">
          AURA Autonomous Search & Rescue Platform • Powered by DroneKit + FLIR Simulation
        </p>
      </div>

      <BottomNav active="home" />
    </div>
  )
}

export default Landing

