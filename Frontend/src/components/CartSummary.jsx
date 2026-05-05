import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiShoppingBag, FiChevronRight } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { useOrder } from "../context/OrderContext"

const CartSummary = () => {
  const { totalItems, totalPrice } = useOrder()
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
            className="pointer-events-auto w-full max-w-lg mx-auto flex items-center justify-between pl-5 pr-2 py-2 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                  <FiShoppingBag size={18} className="text-slate-700" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white">
                  <span className="text-[9px] font-bold text-white">{totalItems}</span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-[13px] font-bold text-slate-900">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
                <p className="text-[12px] font-semibold text-emerald-600">₹{totalPrice}</p>
              </div>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/track")}
              className="flex items-center gap-1.5 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors shadow-sm shadow-emerald-500/20"
            >
              <span className="text-[13px] font-bold text-white">Place Order</span>
              <FiChevronRight size={16} className="text-white" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CartSummary
