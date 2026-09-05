import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiChevronRight, FiShield } from "react-icons/fi"
import { FaBriefcaseMedical, FaRocket } from "react-icons/fa"
import { TbFirstAidKit } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import { useOrder } from "../context/OrderContext"

const CartSummary = () => {
  const { totalItems, placeOrder, orderPlaced } = useOrder()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-24 pointer-events-none"
        >
          <motion.div
            className="pointer-events-auto w-full max-w-lg mx-auto flex items-center justify-between pl-4 pr-2 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-red-600/40">
                  <TbFirstAidKit size={20} />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                  <span className="text-[9px] font-black text-white">{totalItems}</span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-[13px] font-extrabold text-white">{totalItems} Medical Aid Pack{totalItems > 1 ? "s" : ""}</p>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Payload Verified • Ready to Drop</p>
              </div>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!orderPlaced) placeOrder()
                navigate("/track")
              }}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 rounded-xl transition-all shadow-lg shadow-red-600/30"
            >
              <span className="text-[12px] font-black uppercase tracking-wider text-white">Launch SAR Drone</span>
              <FiChevronRight size={16} className="text-white" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CartSummary

