import React from "react"
import { motion } from "framer-motion"
import { FiPlus, FiMinus } from "react-icons/fi"

const ProductCard = ({ product, qty, onAdd, onRemove }) => {
  const IconComp = product.Icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 group hover:border-slate-200 hover:shadow-card transition-all duration-300"
    >
      {/* Tag */}
      {product.tag && (
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-indigo-50 rounded-full">
          <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">
            {product.tag}
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={`w-14 h-14 ${product.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <IconComp size={26} className={product.color} />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-[13px] font-semibold text-slate-800 leading-tight">
          {product.name}
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">{product.weight}</p>
      </div>

      {/* Price + Action */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[15px] font-bold text-slate-900">
          ₹{product.price}
        </span>

        {qty > 0 ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 bg-slate-900 rounded-xl px-1 py-0.5"
          >
            <button
              onClick={onRemove}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors"
            >
              <FiMinus size={14} className="text-white" />
            </button>
            <span className="text-[13px] font-bold text-white w-5 text-center tabular-nums">
              {qty}
            </span>
            <button
              onClick={onAdd}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors"
            >
              <FiPlus size={14} className="text-white" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-200"
          >
            <FiPlus size={13} className="text-slate-600" />
            <span className="text-[11px] font-semibold text-slate-600">ADD</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default ProductCard
