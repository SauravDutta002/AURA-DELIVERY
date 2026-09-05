import React from "react"
import { motion } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import { FiArrowLeft, FiMapPin, FiMoreHorizontal, FiActivity, FiNavigation, FiShield } from "react-icons/fi"
import { FaBriefcaseMedical, FaHeartbeat } from "react-icons/fa"
import { TbFirstAidKit } from "react-icons/tb"
import { useOrder } from "../context/OrderContext"
import SimulationBadge from "../components/SimulationBadge"

const statusConfig = {
  in_transit:  { label: "SAR In Flight",       bg: "bg-red-50",     text: "text-red-600",     border: "border-red-100" },
  delivered:   { label: "Medical Aid Deployed",bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  pending:     { label: "Mission Standby",     bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100" },
}

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getOrderById } = useOrder()
  const order = getOrderById(id)

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100">
          <TbFirstAidKit size={28} />
        </div>
        <p className="text-[14px] font-bold text-slate-800">Mission Record Not Found</p>
        <button onClick={() => navigate("/shipments")} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[12px] font-bold">
          Back to SAR Logs
        </button>
      </div>
    )
  }

  const status = statusConfig[order.status] || statusConfig.pending
  const totalWeight = (order.totalItems * 0.4).toFixed(1)

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-8">
      <SimulationBadge />

      {/* ── Header ─────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center border border-slate-100 transition-colors"
            >
              <FiArrowLeft size={16} className="text-slate-600" />
            </motion.button>
            <div>
              <p className="text-[15px] font-black text-slate-900">Mission #{order.id}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Search & Rescue Mission Log</p>
            </div>
          </div>
          <div className={`px-2.5 py-1 ${status.bg} rounded-full border ${status.border}`}>
            <span className={`text-[10px] font-extrabold ${status.text} uppercase tracking-wide`}>{status.label}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 flex flex-col gap-4">
        {/* ── Mission Brief Card ──────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
            <div className="w-9 h-9 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <FaBriefcaseMedical size={16} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SAR Target</p>
              <p className="text-[13px] font-black text-slate-900">Survivor Search & Medical Drop</p>
            </div>
          </div>

          {/* Mission Info */}
          <div className="px-4 py-3.5 border-b border-slate-100">
            <p className="text-[13px] font-extrabold text-slate-900 mb-1">
              Autonomous Medical Aid Drone Payload
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Medical equipment: {order.items.map(i => i.name).join(", ")}. Tether winch delivery with 5.0m altitude hold.
            </p>
          </div>

          {/* Items List */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Equipped Medical Payloads</p>
            {order.items.map((item, i) => (
              <div key={item.id} className={`flex items-center justify-between py-2 ${i < order.items.length - 1 ? "border-b border-slate-50" : ""}`}>
                <div className="flex items-center gap-2.5">
                  {item.Icon && <item.Icon size={16} className={item.color || "text-red-500"} />}
                  <div>
                    <p className="text-[12px] font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.weight}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                    ×{item.qty} PACK
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mission Details */}
          <div className="px-4 py-3.5">
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Payload Units</p>
                <p className="text-[12px] font-black text-slate-800 mt-0.5">{order.totalItems} Items</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Payload Weight</p>
                <p className="text-[12px] font-black text-slate-800 mt-0.5">{totalWeight} kg</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mission Type</p>
                <p className="text-[12px] font-black text-red-600 mt-0.5">Emergency SAR</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tether Protocol</p>
                <p className="text-[12px] font-black text-emerald-600 mt-0.5">Servo Winch 5m</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Coordinates & Target Location ───────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Survivor Target Grid</p>
            <p className="text-[10px] text-slate-400 font-medium">{order.date}</p>
          </div>
          <div className="flex items-start gap-2.5 mt-1">
            <FiMapPin size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-bold text-slate-900">
                SAR Target Zone Alpha — Victim Landing Point
              </p>
              <p className="text-[10px] text-red-600 font-mono font-bold mt-0.5">
                30.013363° N, 78.221071° E
              </p>
            </div>
          </div>
        </div>

        {/* ── Action Button ──────────────────────────── */}
        {order.status === "in_transit" && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/track")}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 rounded-2xl text-white text-[14px] font-black flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all uppercase tracking-wider"
          >
            <FiNavigation size={18} />
            Track Live SAR Flight & Drop
          </motion.button>
        )}

        {order.status === "delivered" && (
          <div className="w-full py-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-700 text-[14px] font-extrabold flex items-center justify-center gap-2">
            <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[11px] font-black">✓</span>
            </span>
            Medical Aid Successfully Deployed
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetail

