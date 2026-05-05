import React, { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft, FiSearch, FiChevronRight, FiPackage, FiClock, FiHome } from "react-icons/fi"
import { MdLocalShipping } from "react-icons/md"
import { FaCheck } from "react-icons/fa"
import { useOrder } from "../context/OrderContext"
import SimulationBadge from "../components/SimulationBadge"

const statusConfig = {
  in_transit:  { label: "In Transit",      bg: "bg-violet-50",  text: "text-violet-600", border: "border-violet-100", dot: "bg-violet-500" },
  delivered:   { label: "Delivered",        bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", dot: "bg-emerald-500" },
  pending:     { label: "Awaiting Pickup",  bg: "bg-amber-50",   text: "text-amber-600",  border: "border-amber-100",  dot: "bg-amber-500" },
}

const tabs = ["All", "Active", "Delivered"]

const Shipments = () => {
  const navigate = useNavigate()
  const { orderHistory } = useOrder()
  const [activeTab, setActiveTab] = useState("All")
  const [search, setSearch] = useState("")

  const filtered = orderHistory.filter((order) => {
    const matchTab =
      activeTab === "All" ||
      (activeTab === "Active" && order.status === "in_transit") ||
      (activeTab === "Delivered" && order.status === "delivered")
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
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">My Shipments</h1>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <FiSearch size={15} className="text-slate-300 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shipment..."
              className="flex-1 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-300 outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Order List ─────────────────────────────── */}
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
                  className="bg-white rounded-2xl border border-slate-100 p-4 cursor-pointer hover:border-slate-200 hover:shadow-sm transition-all active:scale-[0.98]"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FiPackage size={15} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">#{order.id}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{order.totalItems} item{order.totalItems > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2.5 py-1 ${status.bg} rounded-full border ${status.border}`}>
                        <span className={`text-[9px] font-bold ${status.text} uppercase tracking-wide`}>{status.label}</span>
                      </div>
                      <FiChevronRight size={16} className="text-slate-300" />
                    </div>
                  </div>

                  {/* Price */}
                  <p className="text-[18px] font-bold text-slate-900 mb-3">₹{order.totalPrice}</p>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Shipped by</p>
                      <p className="text-[11px] font-semibold text-slate-700 mt-0.5">AURA Drone</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-medium">Date</p>
                      <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{order.date}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <FiPackage size={28} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-[14px] font-semibold text-slate-700">No shipments yet</p>
              <p className="text-[12px] text-slate-400 mt-1">Place your first order to see it here</p>
            </div>
            <button
              onClick={() => navigate("/order")}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[12px] font-semibold hover:bg-slate-800 transition-colors"
            >
              Start Ordering
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
    { id: "home",      label: "Home",      icon: FiHome,          path: "/" },
    { id: "order",     label: "Order",     icon: FiPackage,       path: "/order" },
    { id: "shipments", label: "Shipments", icon: FiClock,         path: "/shipments" },
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
                isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-slate-900" : "text-slate-400"} />
              <span className={`text-[10px] font-semibold ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div layoutId="nav-dot" className="w-1 h-1 bg-slate-900 rounded-full" />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default Shipments
