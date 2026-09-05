import React from "react"
import { motion } from "framer-motion"
import { FiPlus, FiMinus, FiCheck } from "react-icons/fi"

const ProductCard = ({ product, qty, onAdd, onRemove }) => {
  const IconComp = product.Icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 group hover:border-red-200 hover:shadow-md transition-all duration-300"
    >
      
      {/* Emergency Tag */}
      {product.tag && (
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-red-50 border border-red-100 rounded-full">
          <span className="text-[9px] font-extrabold text-red-600 uppercase tracking-wider">
            {product.tag}
          </span>
        </div>
      )}

      {/* Medical Icon */}
      <div className={`w-12 h-12 ${product.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-red-100/50 shadow-sm`}>
        <IconComp size={24} className={product.color} />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-[13px] font-bold text-slate-800 leading-tight">
          {product.name}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Weight: {product.weight}</p>
      </div>

      {/* Status + Action */}
      <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100">
        <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">
          {qty > 0 ? "EQUIPPED" : "AVAILABLE"}
        </span>

        {qty > 0 ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 bg-slate-900 rounded-xl px-1 py-0.5 shadow-sm"
          >
            <button
              onClick={onRemove}
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors text-white"
            >
              <FiMinus size={12} />
            </button>
            <span className="text-[12px] font-black text-white w-4 text-center tabular-nums">
              {qty}
            </span>
            <button
              onClick={onAdd}
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors text-white"
            >
              <FiPlus size={12} />
            </button>
          </motion.div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all duration-200 text-red-600"
          >
            <FiPlus size={12} />
            <span className="text-[10px] font-extrabold uppercase tracking-wider">EQUIP</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default ProductCard