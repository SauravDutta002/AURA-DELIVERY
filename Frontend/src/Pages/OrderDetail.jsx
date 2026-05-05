import React from "react"
import { motion } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import { FiArrowLeft, FiPackage, FiMapPin, FiMoreHorizontal } from "react-icons/fi"
import { FaWarehouse } from "react-icons/fa"
import { MdLocalShipping } from "react-icons/md"
import { useOrder } from "../context/OrderContext"
import SimulationBadge from "../components/SimulationBadge"

const statusConfig = {
  in_transit:  { label: "In Transit",      bg: "bg-violet-50",  text: "text-violet-600", border: "border-violet-100" },
  delivered:   { label: "Delivered",        bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  pending:     { label: "Awaiting Pickup",  bg: "bg-amber-50",   text: "text-amber-600",  border: "border-amber-100" },
}

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getOrderById } = useOrder()
  const order = getOrderById(id)

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
          <FiPackage size={28} className="text-slate-300" />
        </div>
        <p className="text-[14px] font-semibold text-slate-700">Order not found</p>
        <button onClick={() => navigate("/shipments")} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[12px] font-semibold">
          Back to Shipments
        </button>
      </div>
    )
  }

  const status = statusConfig[order.status] || statusConfig.pending
  const totalWeight = (order.totalItems * 0.3).toFixed(1)

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
            <p className="text-[15px] font-bold text-slate-900">#{order.id}</p>
          </div>
          <button className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center border border-slate-100 transition-colors">
            <FiMoreHorizontal size={16} className="text-slate-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 flex flex-col gap-4">
        {/* ── Customer Card ──────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-[13px] font-bold text-slate-500">U</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Customer</p>
              <p className="text-[13px] font-semibold text-slate-900">Simulation User</p>
            </div>
          </div>

          {/* Order Info */}
          <div className="px-4 py-3.5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiPackage size={14} className="text-slate-400" />
                <p className="text-[10px] text-slate-400 font-medium">Order</p>
              </div>
              <div className={`px-2.5 py-1 ${status.bg} rounded-full border ${status.border}`}>
                <span className={`text-[9px] font-bold ${status.text} uppercase tracking-wide`}>{status.label}</span>
              </div>
            </div>
            <p className="text-[13px] font-semibold text-slate-900 mb-1">
              Drone Delivery — {order.totalItems} item{order.totalItems > 1 ? "s" : ""}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Package contains {order.items.map(i => i.name).join(", ")}. Delivered via AURA autonomous drone system.
            </p>
          </div>

          {/* Items List */}
          <div className="px-4 py-3 border-b border-slate-100">
            {order.items.map((item, i) => (
              <div key={item.id} className={`flex items-center justify-between py-2 ${i < order.items.length - 1 ? "border-b border-slate-50" : ""}`}>
                <div className="flex items-center gap-2.5">
                  {item.Icon && <item.Icon size={14} className={item.color || "text-slate-400"} />}
                  <div>
                    <p className="text-[12px] font-medium text-slate-700">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.weight}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-semibold text-slate-800">₹{item.price * item.qty}</p>
                  <p className="text-[10px] text-slate-400">×{item.qty}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Package Details */}
          <div className="px-4 py-3.5">
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Quantity</p>
                <p className="text-[12px] font-semibold text-slate-800 mt-0.5">{order.totalItems}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Weight</p>
                <p className="text-[12px] font-semibold text-slate-800 mt-0.5">{totalWeight} kg</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Type of order</p>
                <p className="text-[12px] font-semibold text-slate-800 mt-0.5">Drone Delivery</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Order cost</p>
                <p className="text-[12px] font-semibold text-slate-800 mt-0.5">₹{order.totalPrice}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Payment method</p>
                <p className="text-[12px] font-semibold text-slate-800 mt-0.5">Simulation</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Status</p>
                <p className="text-[12px] font-semibold text-slate-800 mt-0.5">Paid</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Pickup / Delivery Toggle ───────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100">
            <div className="flex-1 py-3 text-center bg-slate-900 text-white">
              <span className="text-[12px] font-semibold">Pickup</span>
            </div>
            <div className="flex-1 py-3 text-center bg-white text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <span className="text-[12px] font-semibold">Delivery</span>
            </div>
          </div>

          <div className="px-4 py-3.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-400 font-medium">Pickup address</p>
              <p className="text-[10px] text-slate-400 font-medium">{order.date}</p>
            </div>
            <div className="flex items-start gap-2 mt-1">
              <FiMapPin size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] font-medium text-slate-800 leading-relaxed">
                AURA Warehouse Hub, Sector 17, Chandigarh 160017
              </p>
            </div>

            {/* Mini map placeholder */}
            <div className="mt-3 h-28 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <FaWarehouse size={20} className="text-slate-300 mx-auto" />
                <p className="text-[10px] text-slate-400 font-medium mt-1">Warehouse Location</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action Button ──────────────────────────── */}
        {order.status === "in_transit" && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/track")}
            className="w-full py-4 bg-red-500 hover:bg-red-600 rounded-2xl text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <MdLocalShipping size={18} />
            Track Live
            <span className="ml-1">›</span>
          </motion.button>
        )}

        {order.status === "delivered" && (
          <div className="w-full py-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600 text-[14px] font-bold flex items-center justify-center gap-2">
            <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px]">✓</span>
            </span>
            Delivered Successfully
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetail
