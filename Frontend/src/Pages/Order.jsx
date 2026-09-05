import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiSearch, FiBell, FiUser, FiChevronDown, FiMic, FiNavigation, FiClock, FiStar, FiActivity, FiShield, FiAlertTriangle } from "react-icons/fi"
import { FaHeartbeat, FaBriefcaseMedical, FaRocket } from "react-icons/fa"
import { GiDefibrilate, GiRadarSweep } from "react-icons/gi"
import { useNavigate } from "react-router-dom"
import { categories } from "../data/products"
import { shops } from "../data/shops"
import { useOrder } from "../context/OrderContext"
import CartSummary from "../components/CartSummary"
import SimulationBadge from "../components/SimulationBadge"
import { BottomNav } from "./Shipments"

const Order = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [search, setSearch] = useState("")
  const { addToCart, removeFromCart, getQty, orderPlaced, placeOrder } = useOrder()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (orderPlaced) {
      navigate('/track', { replace: true })
    }
  }, [orderPlaced, navigate])

  const filtered = shops.filter((s) => {
    const matchCat = activeCategory === "all" || s.category === activeCategory
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative">

      {/* ── Premium AURA MED-SAR Command Header ──────────────── */}
      <div className="bg-slate-900 pt-10 pb-10 px-5 relative z-10 rounded-b-[2rem] shadow-[0_12px_40px_rgb(0,0,0,0.2)] border-b border-slate-800">
        
        {/* Top Row: Logo & Status */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/40 border border-red-500/50">
              <FaBriefcaseMedical size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-[22px] font-black tracking-tight text-white leading-none">
                  AURA <span className="text-red-500">MED-SAR</span>
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-red-500/20 text-red-400 border border-red-500/30">V2.4</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Autonomous Search & Rescue Drone
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Drone Ready</span>
            </div>
          </div>
        </div>

        {/* Rapid Dispatch Banner */}
        <div className="bg-gradient-to-r from-red-950/80 via-slate-800/90 to-slate-800/90 p-3.5 rounded-2xl border border-red-500/30 mb-5 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
              <GiRadarSweep size={22} className="animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <p className="text-[12px] font-extrabold text-white">Emergency Victim Search & Rescue</p>
              <p className="text-[10px] text-slate-300 font-medium">Autonomous thermal scan + medical aid tether drop</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!orderPlaced) placeOrder()
              navigate('/track')
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[11px] rounded-xl shadow-lg shadow-red-600/40 hover:brightness-110 active:scale-95 transition-all flex-shrink-0 flex items-center gap-1.5 uppercase tracking-wide"
          >
            <span>Launch SAR</span>
            <span>→</span>
          </button>
        </div>

        {/* Middle Row: Station Location & Response Time */}
        <div className="flex items-end justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 cursor-pointer">
              <h2 className="text-[15px] font-bold text-white">Rescue Base Alpha</h2>
              <FiChevronDown size={16} className="text-white/80" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate max-w-[200px]">
              Active GPS: 30.0112° N, 78.2217° E
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <p className="text-[9px] text-red-400 font-extrabold uppercase tracking-widest mb-1">Target Response</p>
            <div className="flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/30">
              <FiClock size={13} className="text-red-400" />
              <p className="text-[13px] font-black text-red-400">~3 Mins</p>
            </div>
          </div>
        </div>

        {/* Search bar (Floating) */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-xl border border-slate-100 focus-within:ring-2 focus-within:ring-red-500/20 transition-all absolute left-4 right-4 -bottom-6">
          <FiSearch size={18} className="text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search medical payloads, AED, trauma kits...'
            className="flex-1 bg-transparent text-[13px] text-slate-800 placeholder:text-slate-400 font-semibold outline-none"
          />
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <FiMic size={18} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" />
        </div>
      </div>

      {/* ── Payload Categories ──────────────────────────── */}
      <div className="flex gap-2.5 px-5 pt-10 pb-3 overflow-x-auto scrollbar-hide relative z-0">
        {categories.map((cat) => {
          const CatIcon = cat.Icon
          const isActive = activeCategory === cat.id
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm"
              }`}
            >
              <CatIcon size={14} className={isActive ? "text-red-400" : "text-slate-400"} />
              {cat.name}
            </motion.button>
          )
        })}
      </div>

      {/* ── Emergency Response Hubs & Payload Units ───────────────────────────── */}
      <div className="flex-1 px-5 pt-1 pb-36 overflow-y-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[13px] font-extrabold text-slate-700 uppercase tracking-wider">
            Available Medical Rescue Squadrons
          </h3>
          <span className="text-[11px] font-bold text-slate-400">
            {filtered.length} Stations Active
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((shop) => (
              <motion.div
                key={shop.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/shop/${shop.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col cursor-pointer hover:shadow-md transition-shadow group"
              >
                <div className="h-36 w-full bg-slate-100 relative overflow-hidden">
                  <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md flex items-center gap-1 text-[9px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    SAR Standby
                  </div>

                  <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold text-slate-800 shadow-sm">
                    <FiClock className="text-red-500" size={12} />
                    {shop.deliveryTime}
                  </div>

                  <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold text-slate-800 shadow-sm">
                    <FiShield className="text-emerald-500" size={12} />
                    <span>Certified Aid</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-extrabold text-slate-900 text-[15px] leading-tight">{shop.name}</h3>
                  <p className="text-[12px] text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">{shop.description}</p>
                  
                  <div className="flex gap-1.5 mt-3 overflow-hidden flex-wrap">
                     {shop.tags.map(tag => (
                        <span key={tag} className="text-[9px] uppercase tracking-wider font-extrabold bg-red-50 text-red-600 px-2 py-0.5 rounded-md border border-red-100">
                           {tag}
                        </span>
                     ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FiSearch size={32} className="text-slate-200" />
            <p className="text-[13px] text-slate-400 font-medium">No medical rescue stations found</p>
          </div>
        )}
      </div>

      {/* ── Floating Mission Dispatch Bar ──────────────────────── */}
      <CartSummary />

      {/* ── Bottom Nav ─────────────────────────────── */}
      <BottomNav active="home" />
    </div>
  )
}

export default Order

