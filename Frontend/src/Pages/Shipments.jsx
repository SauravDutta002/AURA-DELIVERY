import React, { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft, FiSearch, FiChevronRight, FiClock, FiHome, FiNavigation, FiActivity } from "react-icons/fi"
import { FaBriefcaseMedical, FaHeartbeat } from "react-icons/fa"
import { TbFirstAidKit } from "react-icons/tb"
import { useOrder } from "../context/OrderContext"
import SimulationBadge from "../components/SimulationBadge"

const statusConfig = {
  in_transit:  { label: "SAR In Flight",       bg: "bg-red-50",     text: "text-red-600",     border: "border-red-100",     dot: "bg-red-500" },
  delivered:   { label: "Aid Deployed",        bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", dot: "bg-emerald-500" },
  pending:     { label: "Mission Standby",     bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",   dot: "bg-amber-500" },
}

const tabs = ["All Missions", "Active Flights", "Aid Deployed"]

const Shipments = () => {
  const navigate = useNavigate()
  const { orderHistory } = useOrder()
  const [activeTab, setActiveTab] = useState("All Missions")
  const [search, setSearch] = useState("")

  const filtered = orderHistory.filter((order) => {
    const matchTab =
      activeTab === "All Missions" ||
      (activeTab === "Active Flights" && order.status === "in_transit") ||
      (activeTab === "Aid Deployed" && order.status === "delivered")
    const matchSearch = order.id.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <SimulationBadge />

      {/* ── Header ─────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 px-5 pt-5 pb-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center border border-slate-100 transition-colors"
          >
            <FiArrowLeft size={16} className="text-slate-600" />
          </motion.button>
          <div>
            <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none">Rescue Missions Log</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Autonomous SAR Drone Flight Archive</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <FiSearch size={15} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rescue mission ID..."
              className="flex-1 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 font-medium outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 px-5 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mission List ─────────────────────────────── */}
      <div className="flex-1 px-5 pt-4 pb-24 overflow-y-auto">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map((order, i) => {
              const status = statusConfig[order.status] || statusConfig.pending
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="bg-white rounded-2xl border border-slate-100 p-4 cursor-pointer hover:border-red-200 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center border border-red-100">
                        <TbFirstAidKit size={16} />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-slate-900">Mission #{order.id}</p>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{order.totalItems} Medical Payload Pack{order.totalItems > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2.5 py-0.5 ${status.bg} rounded-full border ${status.border}`}>
                        <span className={`text-[9px] font-extrabold ${status.text} uppercase tracking-wide`}>{status.label}</span>
                      </div>
                      <FiChevronRight size={16} className="text-slate-300" />
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="bg-slate-50 rounded-xl p-2.5 mb-3 border border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Autonomous Tether Winch</span>
                    <span className="text-[10px] font-bold text-red-600 uppercase">Emergency Protocol</span>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Drone Unit</p>
                      <p className="text-[11px] font-bold text-slate-800 mt-0.5">AURA Med-Drone 01</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Timestamp</p>
                      <p className="text-[11px] font-bold text-slate-800 mt-0.5">{order.date}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100">
              <TbFirstAidKit size={28} />
            </div>
            <div className="text-center">
              <p className="text-[14px] font-bold text-slate-800">No rescue missions logged yet</p>
              <p className="text-[12px] text-slate-400 mt-1">Initiate a drone rescue mission to record telemetry</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[12px] font-extrabold transition-colors uppercase tracking-wider shadow-lg shadow-red-600/30"
            >
              Launch SAR Drone
            </button>
          </div>
        )}
      </div>

      {/* ── Bottom Nav ─────────────────────────────── */}
      <BottomNav active="shipments" />
    </div>
  )
}

/* ===== BOTTOM NAV ===== */
export const BottomNav = ({ active }) => {
  const navigate = useNavigate()

  const items = [
    { id: "home",      label: "Command",   icon: FiHome,          path: "/" },
    { id: "track",     label: "Rescue Map",icon: FiNavigation,    path: "/track" },
    { id: "shipments", label: "SAR Logs",  icon: FiClock,         path: "/shipments" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-[9999]">
      <div className="flex items-center justify-around max-w-lg mx-auto py-2 px-4">
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.85 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                isActive ? "text-red-600 font-extrabold" : "text-slate-400 hover:text-slate-600 font-medium"
              }`}
            >
              <item.icon size={19} className={isActive ? "text-red-600" : "text-slate-400"} />
              <span className={`text-[10px] ${isActive ? "text-red-600 font-extrabold" : "text-slate-400"}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div layoutId="nav-dot" className="w-1 h-1 bg-red-600 rounded-full" />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default Shipments

