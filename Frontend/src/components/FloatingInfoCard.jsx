import React, { useRef, useState } from "react"
import { FaCheck } from "react-icons/fa"
import { IoClose } from "react-icons/io5"
import { FiPackage, FiChevronDown, FiChevronUp, FiMapPin } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"
import DroneIcon from "../assets/icons/Drone_Icon.png"

const FloatingInfoCard = ({ loading, booked, confirmed, progress, onAction, orderItems = [], selectedPort = null, orderId = null }) => {
  const [open, setOpen] = useState(true)
  const [showLoadingAnim, setShowLoadingAnim] = useState(false)

  React.useEffect(() => {
    if (confirmed) {
      setShowLoadingAnim(true)
      const timer = setTimeout(() => {
        setShowLoadingAnim(false)
      }, 4000)
      return () => clearTimeout(timer)
    } else {
      setShowLoadingAnim(false)
    }
  }, [confirmed])

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: open ? 0 : "calc(100% - 140px)" }}
      transition={{ type: "spring", damping: 32, stiffness: 300 }}
      className="bg-white rounded-t-[2rem] overflow-hidden pointer-events-auto"
      style={{ boxShadow: "0 -4px 30px rgba(0,0,0,0.1)" }}
    >
      {/* PULL HANDLE */}
      <div
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center pt-3 pb-2 cursor-pointer active:bg-slate-50/50 transition-colors"
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full" />
        {!open && booked && (
          <div className="w-full px-6 mt-2">
            {confirmed ? (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiPackage size={9} className="text-white" />
                </div>
                <div className="flex-1 relative h-[3px]">
                  <div className="absolute inset-0 bg-slate-200 rounded-full" />
                  <motion.div className="absolute top-0 left-0 h-full bg-gradient-to-r from-slate-800 to-violet-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                  <motion.div
                    className="absolute top-1/2 z-10"
                    initial={{ left: "0%" }}
                    animate={{ left: `${Math.min(progress, 90)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ transform: "translate(-50%, -50%)" }}
                  >
                    <svg width="12" height="10" viewBox="0 0 20 16" fill="none">
                      <path d="M2 2 L18 8 L2 14 L6 8 Z" fill="#1e293b" />
                    </svg>
                  </motion.div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  progress > 95 ? 'bg-red-500' : 'bg-white border-[1.5px] border-red-400'
                }`}>
                  <FiMapPin size={10} className={progress > 95 ? 'text-white' : 'text-red-500'} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-semibold text-slate-500">Drone assigned — waiting for launch</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DYNAMIC CONTENT */}
      <div className="px-6 pb-8 flex flex-col">
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState key="loading" />
          ) : !booked ? (
            <BookingState key="booking" onBook={() => onAction("book")} />
          ) : !confirmed ? (
            <ConfirmState key="confirm" onConfirm={() => onAction("confirm")} onCancel={() => onAction("reset")} orderItems={orderItems} selectedPort={selectedPort} orderId={orderId} />
          ) : showLoadingAnim ? (
            <PackageLoadingAnimation key="pack-anim" items={orderItems} />
          ) : progress >= 100 ? (
            <DeliveryCompleteState key="completed" onReset={() => onAction("reset")} selectedPort={selectedPort} />
          ) : (
            <TrackingState key="tracking" progress={progress} onCancel={() => onAction("reset")} orderItems={orderItems} selectedPort={selectedPort} orderId={orderId} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ===== LOADING STATE ===== */
const LoadingState = () => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="py-10 flex flex-col items-center gap-5">
    <div className="relative w-16 h-16 flex items-center justify-center">
      <motion.div className="absolute inset-0 rounded-full border-2 border-slate-200" animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
        <img src={DroneIcon} alt="" className="w-6 h-6 object-contain" style={{ animation: "drone-hover 2s ease-in-out infinite" }} />
      </div>
    </div>
    <div className="flex items-center gap-1">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Connecting</span>
      <motion.span className="text-[11px] font-semibold text-slate-400" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>...</motion.span>
    </div>
  </motion.div>
)

/* ===== BOOKING STATE ===== */
const BookingState = ({ onBook }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col gap-5">
    <div className="pt-1">
      <h2 className="text-[17px] font-semibold text-slate-900 tracking-tight">Schedule Delivery</h2>
      <p className="text-[11px] text-slate-400 font-medium mt-0.5">Choose your dispatch method</p>
    </div>
    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 p-2">
        <img src={DroneIcon} className="w-8 h-8 object-contain" alt="Drone" style={{ animation: "drone-hover 3s ease-in-out infinite" }} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">Aura Express</h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded-full">
            <div className="w-1 h-1 bg-emerald-500 rounded-full" />
            <span className="text-[9px] font-semibold text-emerald-600 uppercase tracking-wider">~5 min</span>
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-lg font-bold text-slate-900">₹0</p>
        <p className="text-[10px] text-slate-400 font-medium">Free</p>
      </div>
    </div>
    <SlideToAction label="Slide to Book" onComplete={onBook} />
  </motion.div>
)

/* ===== CONFIRM STATE ===== */
const ConfirmState = ({ onConfirm, onCancel, orderItems = [], selectedPort = null, orderId = null }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col gap-4">
    {/* Order Card */}
    <div className="flex items-center justify-between pt-1">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
          <FiPackage size={15} className="text-slate-500" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-slate-900">#{orderId || "AURA-8049X"}</p>
          <p className="text-[10px] text-slate-400">Drone Delivery</p>
        </div>
      </div>
      <div className="px-2.5 py-1 bg-amber-50 rounded-full border border-amber-100">
        <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wide">Awaiting Pickup</span>
      </div>
    </div>

    {/* Order items */}
    {orderItems.length > 0 && <OrderItemsPreview items={orderItems} />}

    {/* Route */}
    <div className="flex gap-3.5">
      <div className="flex flex-col items-center pt-1">
        <div className="w-2.5 h-2.5 rounded-full border-[2.5px] border-slate-900 bg-white" />
        <div className="w-[1.5px] flex-1 bg-slate-200 my-1" />
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
      </div>
      <div className="flex-1 flex flex-col gap-4 py-0.5">
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Pickup from</p>
          <p className="text-[13px] font-medium text-slate-900 mt-0.5">AURA Warehouse Hub</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Deliver to</p>
          <p className="text-[13px] font-medium text-slate-900 mt-0.5">{selectedPort?.name || "Nearest SkyLink Port"}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Please collect it from here</p>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="h-px bg-slate-100" />

    {/* Details row */}
    <div className="flex justify-between">
      <div>
        <p className="text-[10px] text-slate-400 font-medium">Shipped by</p>
        <p className="text-[12px] font-semibold text-slate-900 mt-0.5">AURA Drone</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-medium">Order cost</p>
        <p className="text-[12px] font-semibold text-slate-900 mt-0.5">₹{orderItems.reduce((s, p) => s + p.price * p.qty, 0)}</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-medium">ETA</p>
        <p className="text-[12px] font-semibold text-slate-900 mt-0.5">~5 min</p>
      </div>
    </div>

    <SlideToAction label="Slide to Confirm" onComplete={onConfirm} />

    <button onClick={onCancel} className="flex items-center justify-center gap-2 self-center px-5 py-2 rounded-xl hover:bg-red-50 active:scale-[0.97] transition-all group">
      <IoClose size={14} className="text-red-400 group-hover:text-red-500 transition-colors" />
      <span className="text-[11px] font-semibold text-red-400 group-hover:text-red-500 uppercase tracking-wider transition-colors">Cancel</span>
    </button>
  </motion.div>
)

/* ===== ORDER ITEMS PREVIEW ===== */
const OrderItemsPreview = ({ items }) => {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? items : items.slice(0, 3)

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          {items.length} item{items.length > 1 ? "s" : ""}
        </span>
        <span className="text-[11px] font-bold text-slate-700">
          ₹{items.reduce((s, p) => s + p.price * p.qty, 0)}
        </span>
      </div>
      <div className="px-3 py-1.5">
        {shown.map((item, i) => (
          <div key={item.id} className={`flex items-center justify-between py-1.5 ${i < shown.length - 1 ? 'border-b border-slate-50' : ''}`}>
            <div className="flex items-center gap-2.5">
              {item.Icon && <item.Icon size={14} className={item.color || "text-slate-400"} />}
              <span className="text-[12px] text-slate-700 font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 tabular-nums">×{item.qty}</span>
              <span className="text-[11px] font-semibold text-slate-700 tabular-nums">₹{item.price * item.qty}</span>
            </div>
          </div>
        ))}
        {items.length > 3 && (
          <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 font-medium transition-colors py-1">
            {expanded ? <FiChevronUp size={10} /> : <FiChevronDown size={10} />}
            {expanded ? "Show less" : `+${items.length - 3} more items`}
          </button>
        )}
      </div>
    </div>
  )
}

/* ===== TRACKING STATE — Professional shipment-style ===== */
const TrackingState = ({ progress, onCancel, orderItems = [], selectedPort = null, orderId = null }) => {
  const eta = progress < 95 ? Math.max(1, Math.ceil((100 - progress) * 0.15)) : 0
  const distance = (Math.max(0, (100 - progress) * 2.8) / 1000).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
    >
      {/* Stats row — like the reference */}
      <div className="flex items-stretch border-b border-slate-100 pb-4">
        <div className="flex-1 text-center">
          <p className="text-[18px] font-bold text-slate-900 tabular-nums">{distance} km</p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">distance</p>
        </div>
        <div className="w-px bg-slate-100" />
        <div className="flex-1 text-center">
          <p className="text-[18px] font-bold text-slate-900 tabular-nums">{eta > 0 ? `${eta} min` : "—"}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">time left</p>
        </div>
        <div className="w-px bg-slate-100" />
        <div className="flex-1 text-center">
          <p className="text-[18px] font-bold text-slate-900 tabular-nums">{Math.round(progress)}%</p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">progress</p>
        </div>
      </div>

      {/* Progress track — reference style */}
      <div className="flex items-center gap-0 py-2">
        {/* Origin — black package circle */}
        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-md">
          <FiPackage size={16} className="text-white" />
        </div>

        {/* Track container */}
        <div className="flex-1 relative h-[4px] -mx-1">
          {/* Background track */}
          <div className="absolute inset-0 bg-slate-200 rounded-full" />
          {/* Filled progress */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-slate-800 via-violet-600 to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Arrow indicator riding the bar */}
          <motion.div
            className="absolute top-1/2 z-20"
            initial={{ left: "0%" }}
            animate={{ left: `${Math.min(progress, 92)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <div className="flex items-center">
              {/* Triangle arrow */}
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="drop-shadow-md">
                <path d="M2 2 L18 8 L2 14 L6 8 Z" fill="#1e293b" stroke="#1e293b" strokeWidth="1" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Destination — red pin circle */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-md transition-all duration-500 ${
          progress > 95
            ? 'bg-red-500 shadow-red-200'
            : 'bg-white border-2 border-red-400'
        }`}>
          <FiMapPin size={16} className={progress > 95 ? 'text-white' : 'text-red-500'} />
        </div>
      </div>

      {/* SkyLink Port info */}
      {selectedPort && (
        <div className="bg-red-50 rounded-xl border border-red-100 p-3.5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
               <FiMapPin size={13} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-900">{selectedPort.name}</p>
              <p className="text-[9px] text-slate-500 font-medium">{selectedPort.address}</p>
            </div>
          </div>
          <p className="text-[10px] text-red-600 font-medium">Collect your package from this SkyLink Port</p>
          {selectedPort.distance && (
            <p className="text-[9px] text-slate-400 mt-1">{(selectedPort.distance / 1000).toFixed(1)} km from your location</p>
          )}
        </div>
      )}

      {/* Order card */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 p-3.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-slate-100">
              <FiPackage size={13} className="text-slate-500" />
            </div>
            <p className="text-[12px] font-bold text-slate-900 tracking-tight">#{orderId || "AURA-8049X"}</p>
          </div>
          <div className="px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">In Transit</span>
          </div>
        </div>

        {/* Items summary */}
        {orderItems.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            {orderItems.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-2">
                  {item.Icon && <item.Icon size={13} className={item.color || "text-slate-400"} />}
                  <span className="text-[11px] text-slate-600 font-medium">{item.name}</span>
                  <span className="text-[10px] text-slate-400">×{item.qty}</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-700 tabular-nums">₹{item.price * item.qty}</span>
              </div>
            ))}
            {orderItems.length > 2 && (
              <p className="text-[10px] text-slate-400 font-medium pt-1">+{orderItems.length - 2} more items</p>
            )}
          </div>
        )}

        {/* Details */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-3">
          <div>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Shipped by</p>
            <p className="text-[11px] font-semibold text-slate-800 mt-0.5">AURA Drone</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Order cost</p>
            <p className="text-[11px] font-semibold text-slate-800 mt-0.5">₹{orderItems.reduce((s, p) => s + p.price * p.qty, 0)}</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Pickup</p>
            <p className="text-[11px] font-semibold text-slate-800 mt-0.5">{selectedPort ? selectedPort.id : "—"}</p>
          </div>
        </div>
      </div>

      <button onClick={onCancel} className="flex items-center justify-center gap-2 self-center px-5 py-2 rounded-xl hover:bg-red-50 active:scale-[0.97] transition-all group">
        <IoClose size={14} className="text-red-400 group-hover:text-red-500 transition-colors" />
        <span className="text-[11px] font-semibold text-red-400 group-hover:text-red-500 uppercase tracking-wider transition-colors">Cancel Delivery</span>
      </button>
    </motion.div>
  )
}

/* ===== SLIDE-TO-ACTION ===== */
const SlideToAction = ({ label, onComplete }) => {
  const [complete, setComplete] = useState(false)
  const [dragX, setDragX] = useState(0)
  const containerRef = useRef(null)

  const handleDrag = (_, info) => {
    const maxX = containerRef.current ? containerRef.current.offsetWidth - 60 : 280
    const curX = Math.max(0, Math.min(info.offset.x, maxX))
    setDragX(curX)
    if (curX >= maxX * 0.9 && !complete) {
      setComplete(true)
      onComplete()
    }
  }

  return (
    <div ref={containerRef} className="relative h-14 bg-slate-100 rounded-2xl flex items-center overflow-hidden slider-shimmer" style={{ padding: "6px" }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.span className="text-slate-400/70 font-semibold text-[11px] uppercase tracking-[0.25em]" animate={{ opacity: complete ? 0 : 1 - dragX / 200 }}>
          {complete ? "Done" : label}
        </motion.span>
      </div>
      <motion.div
        drag="x" dragConstraints={{ left: 0, right: 300 }} dragElastic={0.02}
        onDrag={handleDrag}
        onDragEnd={() => { if (!complete) setDragX(0) }}
        animate={{ x: complete ? (containerRef.current ? containerRef.current.offsetWidth - 60 : 300) : dragX, scale: complete ? 1.1 : 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="z-10 w-[46px] h-[46px] bg-slate-900 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing text-white shadow-lg"
        style={{ touchAction: "none" }}
      >
        {complete ? (
          <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 12 }}><FaCheck size={16} /></motion.div>
        ) : (
          <motion.span className="text-lg font-light" animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>→</motion.span>
        )}
      </motion.div>
      <motion.div className="absolute left-0 top-0 bottom-0 bg-slate-900/5 rounded-2xl" animate={{ width: complete ? "100%" : dragX + 24 }} transition={{ duration: 0.1 }} />
    </div>
  )
}

/* ===== DELIVERY COMPLETE STATE ===== */
const DeliveryCompleteState = ({ onReset, selectedPort }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
    className="flex flex-col items-center text-center pt-4 pb-2"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
      className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4 relative"
    >
      <motion.div
        className="absolute inset-0 bg-emerald-500 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <FaCheck size={28} />
    </motion.div>
    
    <h2 className="text-[22px] font-extrabold text-slate-900 tracking-tight">Delivery Arrived!</h2>
    <p className="text-[13px] text-slate-500 font-medium mt-1 mb-6 max-w-[260px] leading-relaxed">
      Your package has safely landed at <strong className="text-slate-800">{selectedPort?.name || "SkyLink Port"}</strong>. Ready for pickup.
    </p>

    <button
      onClick={onReset}
      className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-900/20"
    >
      Back to Home
    </button>
  </motion.div>
)

/* ===== TRUE 3D ISOMETRIC PACKAGE LOADER ===== */
const PackageLoadingAnimation = ({ items }) => {
  const [phase, setPhase] = useState("packing") // packing, closing, grabbing, flying
  
  React.useEffect(() => {
    // Realistic timing sequence
    const t1 = setTimeout(() => setPhase("closing"), 1800) // Items finished dropping, flaps close
    const t2 = setTimeout(() => setPhase("grabbing"), 2600) // Drone drops
    const t3 = setTimeout(() => setPhase("flying"), 3600) // Takeoff
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="py-12 flex flex-col items-center justify-center relative overflow-hidden h-[260px]"
    >
      {/* Premium Status Text */}
      <motion.div className="absolute top-2 flex flex-col items-center z-50">
        <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-800">
          {phase === "packing" ? "Packing Order" :
           phase === "closing" ? "Securing Package" :
           phase === "grabbing" ? "Assigning Drone..." :
           "Drone Assigned"}
        </span>
        {phase !== "flying" && (
           <motion.div className="flex gap-1.5 mt-2" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }}>
             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
             <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
           </motion.div>
        )}
      </motion.div>

      {/* Ground Shadow (Static on floor) */}
      <motion.div 
        className="absolute bottom-[35px] w-24 h-6 bg-slate-900/15 blur-[6px] rounded-[50%] z-0"
        animate={{ opacity: phase === "flying" ? 0 : 1, scale: phase === "flying" ? 0.3 : 1 }}
        transition={{ duration: 0.8, ease: "easeIn" }}
      />

      {/* Lift Wrapper (Moves both Drone and Box upwards together) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        animate={{ y: phase === "flying" ? -300 : 0 }}
        transition={{ duration: 0.8, ease: "easeIn" }}
      >
        {/* 3D Isometric Box & Drone */}
        <div className="relative w-full h-full flex items-center justify-center perspective-[1000px] mt-6">
          <motion.div 
            className="relative w-16 h-16"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateX: 60, rotateZ: -45 }}
          >
            {/* Drone (Drops in 3D space and lands directly on box) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
              initial={{ z: 250, opacity: 0 }}
              animate={{ 
                z: phase === "grabbing" || phase === "flying" ? 64 : 250,
                opacity: phase === "packing" || phase === "closing" ? 0 : 1
              }}
              transition={{ 
                z: phase === "grabbing" ? { type: "spring", bounce: 0.4, duration: 0.8 } : { duration: 0.5 },
                opacity: { duration: 0.3 }
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Counter-rotate icon to face camera */}
              <div className="relative" style={{ transform: "rotateZ(45deg) rotateX(-60deg) translateY(-20px)" }}>
                <img src={DroneIcon} alt="Drone" className="w-[72px] h-[72px] object-contain drop-shadow-2xl" />
                {/* Thrusters attached to drone */}
                {phase === "flying" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 0.8, height: 40 }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-b from-cyan-300/40 to-transparent blur-md rounded-b-full"
                  />
                )}
              </div>
            </motion.div>

            {/* Floor */}
            <div className="absolute inset-0 bg-[#5c3a14] shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]" style={{ transformStyle: "preserve-3d" }} />

            {/* Items Drop (Translate in Z axis) */}
            {items && items.slice(0, 3).map((item, i) => {
              const Icon = item.Icon;
              return (
                <motion.div
                  key={item.id}
                  className="absolute left-4 top-4 w-6 h-6 bg-white/95 rounded shadow-sm border border-slate-100 flex items-center justify-center"
                  initial={{ z: 200, opacity: 0 }}
                  animate={{ 
                    z: phase === "packing" ? [200, 0] : 0, 
                    opacity: phase === "packing" ? [0, 1] : 1 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: phase === "packing" ? 0.2 + (i * 0.2) : 0, 
                    ease: "easeIn" 
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div style={{ transform: "rotateZ(45deg) rotateX(-60deg)" }}>
                    {Icon && <Icon size={12} className={item.color} />}
                  </div>
                </motion.div>
              )
            })}

            {/* Wall 1 (Back Left) */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#8c5e2a] to-[#754c20] origin-top border-t border-[#8f622d]/40" style={{ transform: "rotateX(90deg)", transformStyle: "preserve-3d" }}>
              <motion.div 
                className="absolute top-full left-0 w-16 h-8 bg-[#9c6a30] origin-top border-b border-[#8f622d]/20"
                initial={{ rotateX: 120 }} // Starts Open
                animate={{ rotateX: phase === "packing" ? 120 : -90 }}
                transition={{ duration: 0.4, delay: phase === "closing" ? 0.3 : 0 }}
              />
            </div>

            {/* Wall 4 (Back Right) */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#754e22] to-[#5c3d1b] origin-right border-r border-[#704a1f]/40" style={{ transform: "rotateY(90deg)", transformStyle: "preserve-3d" }}>
              <motion.div 
                className="absolute top-0 right-full w-8 h-16 bg-[#855827] origin-right border-l border-[#704a1f]/20"
                initial={{ rotateY: 120 }} // Starts Open
                animate={{ rotateY: phase === "packing" ? 120 : -90 }}
                transition={{ duration: 0.4, delay: phase === "closing" ? 0.4 : 0 }}
              />
            </div>

            {/* Wall 3 (Front Left) */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#e0b482] to-[#c79b68] origin-left border-l border-[#c49762]/50 shadow-[-2px_0_5px_rgba(0,0,0,0.05)]" style={{ transform: "rotateY(-90deg)", transformStyle: "preserve-3d" }}>
              <motion.div 
                className="absolute top-0 left-full w-8 h-16 bg-[#ebc294] origin-left border-r border-[#c49762]/30"
                initial={{ rotateY: -120 }} // Starts Open
                animate={{ rotateY: phase === "packing" ? -120 : 90 }}
                transition={{ duration: 0.4, delay: phase === "closing" ? 0.2 : 0 }}
              />
            </div>

            {/* Wall 2 (Front Right) */}
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-bl from-[#c49762] to-[#a87e4f] origin-bottom border-b border-[#a87e4f]/50 shadow-[0_2px_5px_rgba(0,0,0,0.05)]" style={{ transform: "rotateX(-90deg)", transformStyle: "preserve-3d" }}>
              <motion.div 
                className="absolute bottom-full left-0 w-16 h-8 bg-[#d1a673] origin-bottom border-t border-[#a87e4f]/30"
                initial={{ rotateX: -120 }} // Starts Open
                animate={{ rotateX: phase === "packing" ? -120 : 90 }}
                transition={{ duration: 0.4, delay: phase === "closing" ? 0.1 : 0 }}
              />
              {/* Shipping Label on Front Wall */}
              <div className="absolute top-2 right-2 w-5 h-3 bg-white/95 rounded-[1px] p-[1.5px] shadow-sm flex flex-col justify-between" style={{ transform: "rotateX(180deg) rotateZ(10deg)" }}>
                <div className="w-full h-[1px] bg-slate-800" />
                <div className="w-2/3 h-[1px] bg-slate-800" />
              </div>
              {/* Tape Seam when closed */}
              {(phase === "closing" || phase === "grabbing" || phase === "flying") && (
                 <motion.div 
                   initial={{ scaleX: 0 }}
                   animate={{ scaleX: 1 }}
                   transition={{ delay: 0.6, duration: 0.2 }}
                   className="absolute bottom-full left-0 right-0 h-[6px] bg-white/20 backdrop-blur-sm origin-left z-50 border-y border-white/30"
                   style={{ transform: "rotateX(90deg) translateZ(1px)" }} // Folds flat over the top
                 />
              )}
            </div>

          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FloatingInfoCard
