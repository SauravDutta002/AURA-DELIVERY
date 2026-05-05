import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiSearch, FiBell, FiUser, FiChevronDown, FiMic, FiNavigation } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { categories, products } from "../data/products"
import { useOrder } from "../context/OrderContext"
import ProductCard from "../components/ProductCard"
import CartSummary from "../components/CartSummary"
import SimulationBadge from "../components/SimulationBadge"
import { BottomNav } from "./Shipments"

const Order = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [search, setSearch] = useState("")
  const { addToCart, removeFromCart, getQty } = useOrder()
  const navigate = useNavigate()

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative">
      <SimulationBadge />

      {/* ── Blinkit-Style Blue Header ──────────────── */}
      <div className="bg-gradient-to-b from-sky-200 via-blue-100 to-[#f8fafc] pt-12 pb-2 px-4 relative z-10">
        
        {/* Top Row: Logo & Profile */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-[26px] font-black tracking-tight text-[#1a1a1a]">
            SkyLink
          </h1>
          <button className="w-9 h-9 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-colors">
            <FiUser size={18} className="text-[#1a1a1a]" />
          </button>
        </div>

        {/* Middle Row: Location & ETA */}
        <div className="flex items-end justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <h2 className="text-[15px] font-extrabold text-[#1a1a1a]">Home</h2>
              <FiChevronDown size={16} className="text-[#1a1a1a]" />
            </div>
            <p className="text-[11px] text-black/60 font-medium mt-0.5 truncate max-w-[180px]">
              Near AURA SkyLink Port, Block B...
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <p className="text-[11px] text-black/60 font-bold uppercase tracking-wide">Delivering in</p>
            <div className="flex items-center gap-1 mt-0.5">
              <FiNavigation size={16} className="text-[#0e9f6e] rotate-45" />
              <p className="text-[16px] font-black text-[#0e9f6e]">5 Mins</p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-3 px-3 py-3 bg-white rounded-xl shadow-sm border border-black/5 focus-within:shadow-md transition-shadow">
          <FiSearch size={18} className="text-black/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search for "Groceries"'
            className="flex-1 bg-transparent text-[14px] text-[#1a1a1a] placeholder:text-black/40 font-medium outline-none"
          />
          <div className="w-px h-5 bg-black/10 mx-1" />
          <FiMic size={18} className="text-black/60" />
        </div>
      </div>

      {/* ── Category Tabs ──────────────────────────── */}
      <div className="flex gap-2.5 px-5 pt-6 pb-4 overflow-x-auto scrollbar-hide relative z-0">
        {categories.map((cat) => {
          const CatIcon = cat.Icon
          const isActive = activeCategory === cat.id
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20"
                  : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
              }`}
            >
              <CatIcon size={16} />
              {cat.name}
            </motion.button>
          )
        })}
      </div>

      {/* ── Product Grid ───────────────────────────── */}
      <div className="flex-1 px-5 pt-2 pb-36 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  qty={getQty(product.id)}
                  onAdd={() => addToCart(product)}
                  onRemove={() => removeFromCart(product.id)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 gap-3"
            >
              <FiSearch size={32} className="text-slate-200" />
              <p className="text-[13px] text-slate-400 font-medium">No products found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Floating Cart Bar ──────────────────────── */}
      <CartSummary />

      {/* ── Bottom Nav ─────────────────────────────── */}
      <BottomNav active="home" />
    </div>
  )
}

export default Order
