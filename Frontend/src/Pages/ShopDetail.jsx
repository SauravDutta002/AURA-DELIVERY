import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FiArrowLeft, FiStar, FiClock, FiInfo, FiShield } from "react-icons/fi"
import { FaBriefcaseMedical, FaHeartbeat } from "react-icons/fa"
import { shops } from "../data/shops"
import { products } from "../data/products"
import { useOrder } from "../context/OrderContext"
import ProductCard from "../components/ProductCard"
import CartSummary from "../components/CartSummary"
import { motion } from "framer-motion"

const ShopDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, removeFromCart, getQty } = useOrder()

  const shop = shops.find((s) => s.id === id)

  if (!shop) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-slate-800">Station not found</h2>
        <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-full">Go Back</button>
      </div>
    )
  }

  const shopProducts = products.filter((p) => p.category === shop.category)
  const displayProducts = shopProducts.length > 0 ? shopProducts : products.slice(0, 6)

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative pb-36">
      {/* ── Station Header Image ── */}
      <div className="relative h-64 w-full">
        <div className="absolute inset-0 bg-slate-900">
          <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover opacity-70" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-black/60" />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/")} 
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white hover:bg-white/30 transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>

        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-red-600/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-600/40">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          SAR Station
        </div>
      </div>

      {/* ── Station Info Card ── */}
      <div className="relative z-10 px-4 -mt-16 mb-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
              Emergency Squad
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{shop.name}</h1>
          <p className="text-[13px] text-slate-500 font-medium mt-1 mb-3">{shop.description}</p>
          
          <div className="flex items-center gap-3 text-[12px] font-semibold">
            <div className="flex items-center gap-1.5 text-slate-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
              <FiClock className="text-red-500" size={14} />
              <span className="text-red-700 font-bold">{shop.deliveryTime} Response</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              <FiShield className="text-emerald-600" size={14} />
              <span className="text-emerald-700 font-bold">Rapid Drone Fleet</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
            {shop.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Medical Payloads Grid ── */}
      <div className="px-5 flex-1">
        <h3 className="text-[16px] font-extrabold text-slate-900 mb-4 tracking-tight flex items-center gap-2">
          Equip Medical Rescue Payloads
          <span className="flex-1 h-px bg-slate-200 ml-2"></span>
        </h3>
        
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                qty={getQty(product.id)}
                onAdd={() => addToCart(product)}
                onRemove={() => removeFromCart(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-slate-400 font-medium text-sm">No payloads currently configured for this station.</p>
          </div>
        )}
      </div>

      {/* ── Floating Mission Dispatch Bar ── */}
      <CartSummary />
    </div>
  )
}

export default ShopDetail

