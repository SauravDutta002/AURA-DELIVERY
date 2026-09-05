import React, { useRef, useState } from "react"
import { FaCheck } from "react-icons/fa"
import { IoClose } from "react-icons/io5"
import { FiPackage, FiChevronDown, FiChevronUp, FiMapPin } from "react-icons/fi"
import { TbFirstAidKit } from "react-icons/tb"
import { motion, AnimatePresence } from "framer-motion"
import DroneIcon from "../assets/icons/Drone_Icon.png"

const FloatingInfoCard = ({ loading, booked, confirmed, progress, isDelivering, onAction, orderItems = [], selectedPort = null, orderId = null, missionPhase = "idle" }) => {
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
          ) : (missionPhase === "delivering" || isDelivering) && missionPhase !== "returning" && missionPhase !== "complete" ? (
            <WinchDropState key="dropping" />
          ) : missionPhase === "complete" ? (
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
      <motion.div className="absolute inset-0 rounded-full border-2 border-red-500/40" animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
        <img src={DroneIcon} alt="" className="w-6 h-6 object-contain" style={{ animation: "drone-hover 2s ease-in-out infinite" }} />
      </div>
    </div>
    <div className="flex items-center gap-1">
      <span className="text-[11px] font-bold text-red-600 uppercase tracking-[0.2em]">Connecting to SAR Drone Fleet</span>
      <motion.span className="text-[11px] font-bold text-red-600" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>...</motion.span>
    </div>
  </motion.div>
)

/* ===== BOOKING STATE ===== */
const BookingState = ({ onBook }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col gap-5">
    <div className="pt-1">
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
        <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider">Search & Rescue Protocol</span>
      </div>
      <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">Dispatch Medical Drone</h2>
      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Autonomous survivor scan & rapid medical aid deployment</p>
    </div>
    <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-red-50/70 to-slate-50 rounded-2xl border border-red-100/80 shadow-sm">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-red-100 p-2 shadow-sm">
        <img src={DroneIcon} className="w-8 h-8 object-contain" alt="Drone" style={{ animation: "drone-hover 3s ease-in-out infinite" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">AURA Med-Drone SAR-1</h3>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 rounded-full">
            <div className="w-1 h-1 bg-emerald-600 rounded-full" />
            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Payload Ready</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Trauma Kit & AED</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-black text-red-600">EMERGENCY</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Priority #1</p>
      </div>
    </div>
    <SlideToAction label="Slide to Launch Drone" onComplete={onBook} />
  </motion.div>
)

/* ===== CONFIRM STATE ===== */
const ConfirmState = ({ onConfirm, onCancel, orderItems = [], selectedPort = null, orderId = null }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col gap-4">
    {/* Order Card */}
    <div className="flex items-center justify-between pt-1">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
          <TbFirstAidKit size={16} />
        </div>
        <div>
          <p className="text-[13px] font-extrabold text-slate-900">#{orderId || "SAR-8049X"}</p>
          <p className="text-[10px] text-slate-400 font-medium">Emergency Medical Mission</p>
        </div>
      </div>
      <div className="px-2.5 py-1 bg-red-50 rounded-full border border-red-200">
        <span className="text-[9px] font-extrabold text-red-600 uppercase tracking-wide">Awaiting Takeoff</span>
      </div>
    </div>

    {/* Order items */}
    {orderItems.length > 0 && <OrderItemsPreview items={orderItems} />}

    {/* Route */}
    <div className="flex gap-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
      <div className="flex flex-col items-center pt-1">
        <div className="w-2.5 h-2.5 rounded-full border-[2.5px] border-slate-900 bg-white" />
        <div className="w-[1.5px] flex-1 bg-slate-300 my-1" />
        <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
      </div>
      <div className="flex-1 flex flex-col gap-3 py-0.5">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Launch Station</p>
          <p className="text-[12px] font-bold text-slate-900 mt-0.5">AURA Emergency Response Hub</p>
        </div>
        <div>
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Target Survivor Grid</p>
          <p className="text-[12px] font-bold text-slate-900 mt-0.5">{selectedPort?.name || "Target Search Grid Alpha"}</p>
          <p className="text-[9px] text-slate-500 mt-0.5 font-medium">Autonomous Person Scan & Medical Drop</p>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="h-px bg-slate-100" />

    {/* Details row */}
    <div className="flex justify-between px-1">
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unit</p>
        <p className="text-[12px] font-bold text-slate-900 mt-0.5">AURA Med-Drone</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Payload</p>
        <p className="text-[12px] font-bold text-red-600 mt-0.5">Medical Aid Kit</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target ETA</p>
        <p className="text-[12px] font-bold text-emerald-600 mt-0.5">~3 min</p>
      </div>
    </div>

    <SlideToAction label="Slide to Authorize Flight" onComplete={onConfirm} />

    <button onClick={onCancel} className="flex items-center justify-center gap-2 self-center px-5 py-2 rounded-xl hover:bg-red-50 active:scale-[0.97] transition-all group">
      <IoClose size={14} className="text-red-400 group-hover:text-red-500 transition-colors" />
      <span className="text-[11px] font-semibold text-red-400 group-hover:text-red-500 uppercase tracking-wider transition-colors">Abort Mission</span>
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
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Medical Aid Payload ({items.length} item{items.length > 1 ? "s" : ""})
        </span>
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
          Verified
        </span>
      </div>
      <div className="px-3 py-1.5">
        {shown.map((item, i) => (
          <div key={item.id || i} className={`flex items-center justify-between py-1.5 ${i < shown.length - 1 ? 'border-b border-slate-50' : ''}`}>
            <div className="flex items-center gap-2.5">
              {typeof item.Icon === "function" ? (
                <item.Icon size={14} className={item.color || "text-slate-400"} />
              ) : (
                <TbFirstAidKit size={14} className="text-red-500" />
              )}
              <span className="text-[12px] text-slate-700 font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 tabular-nums">×{item.qty || 1}</span>
              <span className="text-[10px] font-bold text-red-600 uppercase">First Aid</span>
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

/* ===== TRACKING STATE — Search & Rescue timeline ===== */
const TrackingState = ({ progress, onCancel, orderItems = [], selectedPort = null, orderId = null }) => {
  const etaSeconds = progress < 95 ? Math.max(1, Math.ceil(((100 - progress) / 44) * 19)) : 0
  const distance = (Math.max(0, (100 - progress) * 2.8) / 1000).toFixed(1)
  
  // Calculate mock telemetry based on progress
  const altitude = progress > 10 && progress < 95 ? 40 : (progress <= 10 ? progress * 4 : (100 - progress) * 8)
  const speed = progress > 15 && progress < 90 ? 60 : (progress <= 15 ? progress * 4 : (100 - progress) * 6)

  const steps = [
    { id: 1, title: "Mission Dispatched", desc: "Command Hub Takeoff", active: progress >= 0, completed: progress >= 10 },
    { id: 2, title: "Airborne & Scanning Sector", desc: "Optical & Thermal Radar", active: progress >= 10, completed: progress > 35 },
    { id: 3, title: "🚨 Person Found — Target Locked", desc: "Coordinates Verified", active: progress > 35, completed: progress >= 85 },
    { id: 4, title: "Deploying Medical Aid", desc: "Winch Descent 5.0m", active: progress >= 85, completed: progress === 100 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
    >
      {/* Stats row */}
      <div className="flex items-stretch border-b border-slate-100 pb-4">
        <div className="flex-1 text-center">
          <p className="text-[18px] font-extrabold text-slate-900 tabular-nums">~{etaSeconds > 0 ? Math.ceil(etaSeconds/60) : 0} min</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Time to Target</p>
        </div>
        <div className="w-px bg-slate-100" />
        <div className="flex-1 text-center">
          <p className="text-[18px] font-extrabold text-red-600 tabular-nums">{Math.round(progress)}%</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">SAR Mission</p>
        </div>
        <div className="w-px bg-slate-100" />
        <div className="flex-1 text-center">
          <p className="text-[18px] font-extrabold text-slate-900 tabular-nums">{distance} km</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Range</p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="px-2 py-2">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex gap-4 relative">
             {idx !== steps.length - 1 && (
               <div className={`absolute left-[11px] top-6 w-[2px] h-full ${step.completed ? 'bg-slate-800' : 'bg-slate-100'}`} />
             )}
             <div className="relative z-10 flex flex-col items-center mt-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  step.completed ? 'bg-slate-900 text-white' : 
                  step.active ? (step.id === 3 ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]') : 
                  'bg-slate-100 text-slate-400'
                }`}>
                   {step.completed ? <FaCheck size={10} /> : step.id}
                </div>
             </div>
             <div className={`pb-4 ${step.active || step.completed ? 'opacity-100' : 'opacity-40'}`}>
                <p className={`text-[13px] font-extrabold ${step.active && !step.completed ? (step.id === 3 ? 'text-red-600' : 'text-emerald-600') : 'text-slate-900'}`}>{step.title}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{step.desc}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Live Telemetry Card */}
      <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between text-white shadow-xl overflow-hidden relative border border-slate-800">
         <div className="absolute -right-4 -top-4 opacity-10">
            <img src={DroneIcon} alt="bg-drone" className="w-24 h-24 blur-[2px]" />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
               <p className="text-[10px] text-slate-300 font-extrabold uppercase tracking-widest">Live Mission Telemetry</p>
            </div>
            <div className="flex gap-6 mt-1">
               <div>
                  <p className="text-[18px] font-black tabular-nums leading-none">{Math.round(altitude)}<span className="text-[11px] font-medium text-slate-400 ml-1">m</span></p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-1">Altitude</p>
               </div>
               <div>
                  <p className="text-[18px] font-black tabular-nums leading-none">{Math.round(speed)}<span className="text-[11px] font-medium text-slate-400 ml-1">km/h</span></p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-1">Airspeed</p>
               </div>
               <div>
                  <p className="text-[18px] font-black text-red-400 tabular-nums leading-none">37.2<span className="text-[11px] font-medium text-red-300 ml-0.5">°C</span></p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-1">Thermal</p>
               </div>
            </div>
         </div>
         <div className="relative z-10 w-11 h-11 bg-red-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-red-500/30 text-red-400">
            <FiMapPin size={18} />
         </div>
      </div>

      {/* Target Survivor Grid Card */}
      {selectedPort && (
        <div className="bg-red-50/80 rounded-xl border border-red-200 p-3.5 mt-1">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
               <FiMapPin size={13} className="text-white" />
            </div>
            <div>
              <p className="text-[12px] font-black text-slate-900">{selectedPort.name || "Target Search Grid Alpha"}</p>
              <p className="text-[10px] text-slate-600 font-medium">Survivor Target Coordinates Locked</p>
            </div>
          </div>
          <p className="text-[10px] text-red-700 font-bold">Autonomous Medical Aid Drop Point</p>
        </div>
      )}

      <button onClick={onCancel} className="flex items-center justify-center gap-2 self-center px-5 py-2 rounded-xl hover:bg-red-50 active:scale-[0.97] transition-all group mt-1">
        <IoClose size={14} className="text-red-400 group-hover:text-red-500 transition-colors" />
        <span className="text-[11px] font-semibold text-red-400 group-hover:text-red-500 uppercase tracking-wider transition-colors">Abort Mission</span>
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
        <motion.span className="text-slate-400/70 font-bold text-[11px] uppercase tracking-[0.25em]" animate={{ opacity: complete ? 0 : 1 - dragX / 200 }}>
          {complete ? "Authorized" : label}
        </motion.span>
      </div>
      <motion.div
        drag="x" dragConstraints={{ left: 0, right: 300 }} dragElastic={0.02}
        onDrag={handleDrag}
        onDragEnd={() => { if (!complete) setDragX(0) }}
        animate={{ x: complete ? (containerRef.current ? containerRef.current.offsetWidth - 60 : 300) : dragX, scale: complete ? 1.1 : 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="z-10 w-[46px] h-[46px] bg-red-600 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing text-white shadow-lg shadow-red-600/30"
        style={{ touchAction: "none" }}
      >
        {complete ? (
          <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 12 }}><FaCheck size={16} /></motion.div>
        ) : (
          <motion.span className="text-lg font-light" animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>→</motion.span>
        )}
      </motion.div>
      <motion.div className="absolute left-0 top-0 bottom-0 bg-red-600/10 rounded-2xl" animate={{ width: complete ? "100%" : dragX + 24 }} transition={{ duration: 0.1 }} />
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
      className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 relative"
    >
      <motion.div
        className="absolute inset-0 bg-emerald-500 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <FaCheck size={28} />
    </motion.div>
    
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 mb-2">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
      <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Mission Success</span>
    </div>

    <h2 className="text-[22px] font-black text-slate-900 tracking-tight">Medical Aid Deployed!</h2>
    <p className="text-[13px] text-slate-500 font-medium mt-1 mb-6 max-w-[280px] leading-relaxed">
      Emergency medical kit and trauma supplies safely lowered to the survivor at <strong className="text-slate-800">{selectedPort?.name || "Target Sector"}</strong>. Ground rescue units dispatched.
    </p>

    <button
      onClick={onReset}
      className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-900/20"
    >
      Complete Mission / Return to Base
    </button>
  </motion.div>
)

/* ===== WINCH DROP STATE — Dropping Emergency Medical Aid Capsule ===== */
const WinchDropState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="py-8 flex flex-col items-center justify-center relative h-[230px]"
  >
    <div className="absolute top-2 flex flex-col items-center z-50">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 border border-red-300 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
        <span className="text-[10px] font-black tracking-[0.15em] uppercase text-red-700">
          Deploying Medical Aid Payload
        </span>
      </div>
      <span className="text-[10px] font-bold text-slate-500">Autonomous Winch Lowering Trauma Kit (5.0m hold)</span>
      <motion.div className="flex gap-1.5 mt-2" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }}>
        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
        <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
      </motion.div>
    </div>

    {/* Drone hovering at the top */}
    <motion.div 
      className="absolute top-14 z-20"
      animate={{ y: [-2, 2, -2] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <img src={DroneIcon} alt="Drone" className="w-[64px] h-[64px] object-contain drop-shadow-xl" />
    </motion.div>

    {/* The string/winch dropping down */}
    <motion.div
      className="absolute top-[88px] w-[1.5px] bg-red-400 origin-top z-10"
      initial={{ height: 0 }}
      animate={{ height: 85 }}
      transition={{ duration: 6.5, ease: "linear" }}
    />

    {/* Emergency Medical Aid Kit dropping down attached to the winch string */}
    <motion.div
      className="absolute top-[88px] z-20 flex items-center justify-center"
      initial={{ y: 0 }}
      animate={{ y: 85 }}
      transition={{ duration: 6.5, ease: "linear" }}
    >
      <div className="w-9 h-9 bg-red-600 rounded-lg border-2 border-white shadow-xl flex items-center justify-center relative shadow-red-500/50">
        <div className="w-4 h-4 bg-white rounded flex items-center justify-center">
          <span className="text-red-600 text-[11px] font-black leading-none">+</span>
        </div>
        {/* Beacon flasher */}
        <div className="absolute -top-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
      </div>
    </motion.div>

    {/* Survivor on Ground Landing Zone */}
    <div className="absolute bottom-4 flex flex-col items-center">
      <div className="w-28 h-[5px] bg-red-300 rounded-full mb-1" />
      <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-red-600 bg-white/90 px-2 py-0.5 rounded-full border border-red-200">
        <span>👤 Survivor Located Below</span>
      </div>
    </div>
  </motion.div>
)

/* ===== TRUE 3D ISOMETRIC MEDICAL AID KIT LOADER ===== */
const PackageLoadingAnimation = ({ items }) => {
  const [phase, setPhase] = useState("packing") // packing, closing, grabbing, flying
  
  React.useEffect(() => {
    // Realistic timing sequence
    const t1 = setTimeout(() => setPhase("closing"), 1800) // Medical items secured
    const t2 = setTimeout(() => setPhase("grabbing"), 2600) // Drone locks onto payload
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
        <span className="text-[11px] font-black tracking-[0.15em] uppercase text-red-600">
          {phase === "packing" ? "Packing Medical Aid Kit" :
           phase === "closing" ? "Sealing Trauma Payload" :
           phase === "grabbing" ? "Locking Payload to SAR Drone..." :
           "Drone Airborne • Scanning Sector"}
        </span>
        {phase !== "flying" && (
           <motion.div className="flex gap-1.5 mt-2" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }}>
             <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
             <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
             <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
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
        {/* 3D Isometric Medical Box & Drone */}
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

            {/* Floor of Medical Kit */}
            <div className="absolute inset-0 bg-[#991b1b] shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]" style={{ transformStyle: "preserve-3d" }} />

            {/* Items Drop (First aid items translate in Z axis) */}
            {items && items.slice(0, 3).map((item, i) => {
              const IconComp = typeof item.Icon === "function" ? item.Icon : TbFirstAidKit;
              return (
                <motion.div
                  key={item.id || i}
                  className="absolute left-4 top-4 w-6 h-6 bg-white rounded shadow-sm border border-red-100 flex items-center justify-center"
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
                    <IconComp size={12} className={item.color || "text-red-600"} />
                  </div>
                </motion.div>
              )
            })}

            {/* Wall 1 (Back Left) - Emergency Red Medical Kit Wall */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#b91c1c] to-[#991b1b] origin-top border-t border-[#dc2626]/40" style={{ transform: "rotateX(90deg)", transformStyle: "preserve-3d" }}>
              <motion.div 
                className="absolute top-full left-0 w-16 h-8 bg-[#dc2626] origin-top border-b border-[#ef4444]/20"
                initial={{ rotateX: 120 }} // Starts Open
                animate={{ rotateX: phase === "packing" ? 120 : -90 }}
                transition={{ duration: 0.4, delay: phase === "closing" ? 0.3 : 0 }}
              />
            </div>

            {/* Wall 4 (Back Right) */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#991b1b] to-[#7f1d1d] origin-right border-r border-[#b91c1c]/40" style={{ transform: "rotateY(90deg)", transformStyle: "preserve-3d" }}>
              <motion.div 
                className="absolute top-0 right-full w-8 h-16 bg-[#b91c1c] origin-right border-l border-[#dc2626]/20"
                initial={{ rotateY: 120 }} // Starts Open
                animate={{ rotateY: phase === "packing" ? 120 : -90 }}
                transition={{ duration: 0.4, delay: phase === "closing" ? 0.4 : 0 }}
              />
            </div>

            {/* Wall 3 (Front Left) */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#ef4444] to-[#dc2626] origin-left border-l border-[#f87171]/50 shadow-[-2px_0_5px_rgba(0,0,0,0.05)]" style={{ transform: "rotateY(-90deg)", transformStyle: "preserve-3d" }}>
              <motion.div 
                className="absolute top-0 left-full w-8 h-16 bg-[#f87171] origin-left border-r border-[#fca5a5]/30"
                initial={{ rotateY: -120 }} // Starts Open
                animate={{ rotateY: phase === "packing" ? -120 : 90 }}
                transition={{ duration: 0.4, delay: phase === "closing" ? 0.2 : 0 }}
              />
            </div>

            {/* Wall 2 (Front Right) with Red Cross Medical Emblem */}
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-bl from-[#dc2626] to-[#b91c1c] origin-bottom border-b border-[#ef4444]/50 shadow-[0_2px_5px_rgba(0,0,0,0.05)]" style={{ transform: "rotateX(-90deg)", transformStyle: "preserve-3d" }}>
              <motion.div 
                className="absolute bottom-full left-0 w-16 h-8 bg-[#ef4444] origin-bottom border-t border-[#f87171]/30"
                initial={{ rotateX: -120 }} // Starts Open
                animate={{ rotateX: phase === "packing" ? -120 : 90 }}
                transition={{ duration: 0.4, delay: phase === "closing" ? 0.1 : 0 }}
              />
              {/* Medical Cross on Front Wall */}
              <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-[2px] p-[1.5px] shadow-md flex items-center justify-center" style={{ transform: "rotateX(180deg) rotateZ(10deg)" }}>
                <span className="text-red-600 font-black text-[12px] leading-none">+</span>
              </div>
              {/* Emergency Security Seal when closed */}
              {(phase === "closing" || phase === "grabbing" || phase === "flying") && (
                 <motion.div 
                   initial={{ scaleX: 0 }}
                   animate={{ scaleX: 1 }}
                   transition={{ delay: 0.6, duration: 0.2 }}
                   className="absolute bottom-full left-0 right-0 h-[6px] bg-white/40 backdrop-blur-sm origin-left z-50 border-y border-white/50"
                   style={{ transform: "rotateX(90deg) translateZ(1px)" }}
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

