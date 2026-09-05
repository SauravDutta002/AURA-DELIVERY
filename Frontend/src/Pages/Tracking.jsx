import React, { useEffect, useState, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import Map from "../components/Map"
import FloatingInfoCard from "../components/FloatingInfoCard"
import { useOrder } from "../context/OrderContext"
import { skylinkPorts, findNearestPort } from "../data/skyports"
import { motion, AnimatePresence } from "framer-motion"
import { FiArrowLeft } from "react-icons/fi"

/* ═══════════════════════════════════════════════════════════════
   FULLY FRONTEND-ONLY SIMULATED DRONE MISSION
   No backend required — everything runs on timers & lerps.
   
   Mission phases:
     0-10%   → Taking off (altitude climb)
     10-85%  → Flying to target (drone moves on map, person found alert ~30%)
     85-95%  → Descending to 5m hold
     95-100% → Servo/winch active (isDelivering = true)
     100%    → Brief winch hold, then auto-advance to return
     return  → Drone flies back to base (reverse lerp)
     complete → Mission success screen
   ═══════════════════════════════════════════════════════════════ */

// Home / base coordinates
const HOME_POS = { lat: 30.0112224, lng: 78.2217014 }

// Lerp helper
const lerp = (a, b, t) => a + (b - a) * Math.min(1, Math.max(0, t))

const Tracking = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [droneLocation, setDroneLocation] = useState({ ...HOME_POS })

  const [booked, setBooked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura_tracking_booked")) || false } catch { return false }
  })
  const [confirmed, setConfirmed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura_tracking_confirmed")) || false } catch { return false }
  })
  const [progress, setProgress] = useState(0)
  const [isDelivering, setIsDelivering] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPath, setShowPath] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura_tracking_showPath")) || false } catch { return false }
  })
  const [selectedPort, setSelectedPort] = useState(() => {
    try { 
      const item = localStorage.getItem("aura_tracking_port")
      if (!item) return null
      const parsed = JSON.parse(item)
      if (parsed && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
        return parsed
      }
      return null
    } catch { return null }
  })

  // Mission phase: "idle" | "outbound" | "delivering" | "returning" | "complete"
  const [missionPhase, setMissionPhase] = useState("idle")
  const simRef = useRef(null)
  const returnRef = useRef(null)

  useEffect(() => { localStorage.setItem("aura_tracking_booked", JSON.stringify(booked)) }, [booked])
  useEffect(() => { localStorage.setItem("aura_tracking_confirmed", JSON.stringify(confirmed)) }, [confirmed])
  useEffect(() => { localStorage.setItem("aura_tracking_showPath", JSON.stringify(showPath)) }, [showPath])
  useEffect(() => { localStorage.setItem("aura_tracking_port", JSON.stringify(selectedPort)) }, [selectedPort])

  const { orderItems, placeOrder, orderPlaced, resetOrder, cart, currentOrderId } = useOrder()
  const navigate = useNavigate()

  const syncLockRef = useRef(null)

  /* GET USER GEOLOCATION */
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => console.error("Location Error:", error),
        { enableHighAccuracy: true }
      )
    }
  }, [])

  /* ════════════════════════════════════════════════════
     SIMULATED OUTBOUND & DELIVERY FLIGHT
     Runs cleanly once when confirmed is true.
     ════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!confirmed || !selectedPort) return
    if (simRef.current || returnRef.current) return // Already launched
    if (missionPhase === "returning" || missionPhase === "complete") return

    setMissionPhase("outbound")

    const OUTBOUND_MS = 14000 // 14s flight to target location
    const WINCH_MS = 6500     // 6.5s payload delivery hold
    const TICK = 100
    let elapsed = 0

    simRef.current = setInterval(() => {
      elapsed += TICK
      const t = Math.min(elapsed / OUTBOUND_MS, 1)
      const p = t * 100

      // Move the drone along path from HOME to target survivor location
      const droneLat = lerp(HOME_POS.lat, selectedPort.lat, t)
      const droneLng = lerp(HOME_POS.lng, selectedPort.lng, t)
      setDroneLocation({ lat: droneLat, lng: droneLng })
      setProgress(p)

      if (t >= 1) {
        // Arrived at target survivor location -> trigger winch drop / delivery phase!
        clearInterval(simRef.current)
        simRef.current = null
        setProgress(100)
        setIsDelivering(true)
        setMissionPhase("delivering")

        // Hold at target while winch drops medical payload, then start return flight
        setTimeout(() => {
          setIsDelivering(false)
          setMissionPhase("returning")
        }, WINCH_MS)
      }
    }, TICK)

    return () => {
      if (simRef.current) {
        clearInterval(simRef.current)
        simRef.current = null
      }
    }
  }, [confirmed, selectedPort])

  /* ════════════════════════════════════════════════════
     SIMULATED RETURN FLIGHT  (delivering → complete)
     Drone flies back from target to home base
     ════════════════════════════════════════════════════ */
  useEffect(() => {
    if (missionPhase !== "returning" || !selectedPort) return
    if (returnRef.current) return

    const RETURN_MS = 10000 // 10s return flight
    const TICK = 100
    let elapsed = 0

    returnRef.current = setInterval(() => {
      elapsed += TICK
      const t = Math.min(elapsed / RETURN_MS, 1)

      const droneLat = lerp(selectedPort.lat, HOME_POS.lat, t)
      const droneLng = lerp(selectedPort.lng, HOME_POS.lng, t)
      setDroneLocation({ lat: droneLat, lng: droneLng })

      if (t >= 1) {
        clearInterval(returnRef.current)
        returnRef.current = null
        setDroneLocation({ ...HOME_POS })
        setMissionPhase("complete")
        setProgress(100)
      }
    }, TICK)

    return () => {
      if (returnRef.current) {
        clearInterval(returnRef.current)
        returnRef.current = null
      }
    }
  }, [missionPhase, selectedPort])

  /* ════════════════════════════════════════════════════
     UNIFIED ACTION HANDLER (no backend calls!)
     ════════════════════════════════════════════════════ */
  const handleAction = useCallback(async (type) => {
    setLoading(true)
    const safetyTimer = setTimeout(() => setLoading(false), 1500)

    if (type === "book" && userLocation) {
      const nearest = findNearestPort(userLocation.lat, userLocation.lng)
      setSelectedPort(nearest)
      if (!orderPlaced) placeOrder()
      setBooked(true)
      setShowPath(true)
    }

    if (type === "confirm") {
      setConfirmed(true)
      setMissionPhase("outbound")
    }

    if (type === "reset") {
      // Clean up all timers
      if (simRef.current) { clearInterval(simRef.current); simRef.current = null }
      if (returnRef.current) { clearInterval(returnRef.current); returnRef.current = null }

      setBooked(false)
      setConfirmed(false)
      setShowPath(false)
      setSelectedPort(null)
      setDroneLocation({ ...HOME_POS })
      setProgress(0)
      setIsDelivering(false)
      setMissionPhase("idle")
      resetOrder()
    }

    clearTimeout(safetyTimer)
    setLoading(false)
  }, [userLocation, orderPlaced, placeOrder, resetOrder])

  /* ════════════════════════════════════════════════════
     PERSON FOUND ALERT (auto-triggers at ~30% progress & auto-dismisses)
     ════════════════════════════════════════════════════ */
  const [personFoundAlert, setPersonFoundAlert] = useState(false)
  const [alertDismissed, setAlertDismissed] = useState(false)

  useEffect(() => {
    let autoDismissTimer = null
    if (confirmed && progress >= 30 && progress < 95 && missionPhase === "outbound") {
      if (!alertDismissed && !personFoundAlert) {
        setPersonFoundAlert(true)
        // Auto dismiss after 3.5s so payload deployment continues automatically
        autoDismissTimer = setTimeout(() => {
          setPersonFoundAlert(false)
          setAlertDismissed(true)
        }, 3500)
      }
    }
    if (missionPhase === "delivering" || missionPhase === "returning" || missionPhase === "complete") {
      setPersonFoundAlert(false)
    }

    return () => {
      if (autoDismissTimer) clearTimeout(autoDismissTimer)
    }
  }, [confirmed, progress, alertDismissed, personFoundAlert, missionPhase])

  const [showFlirCam, setShowFlirCam] = useState(false)

  /* ════════════════════════════════════════════════════
     Determine what FloatingInfoCard should show
     ════════════════════════════════════════════════════ */
  const getCardProgress = () => {
    if (missionPhase === "complete") return 100
    if (missionPhase === "returning") return 100 // still 100 while returning
    return progress
  }

  const getCardIsDelivering = () => {
    return missionPhase === "delivering" && isDelivering
  }

  const isComplete = missionPhase === "complete"

  // For the status bar text
  const getStatusText = () => {
    if (missionPhase === "returning") return "🔄 RTB — Returning to Base"
    if (progress < 30) return "Airborne • Thermal Scan"
    if (progress < 85) return "🚨 Person Found • Target Lock"
    if (progress < 95) return "Descending to Target"
    return "Deploying Medical Aid"
  }

  return (
    <div className="relative h-screen w-full bg-[#f8fafc] overflow-hidden">
      {/* TOP NAVIGATION BAR */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 w-full z-[10001] px-4 pt-6 pb-3 pointer-events-none"
      >
        <div className="flex items-center justify-between gap-2.5 pointer-events-auto max-w-lg mx-auto">
          <button
            onClick={() => { handleAction("reset"); navigate("/") }}
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center border border-slate-100 shadow-sm hover:bg-white transition-colors flex-shrink-0"
          >
            <FiArrowLeft size={20} className="text-slate-800" />
          </button>
          
          {/* Mission status bar - outbound */}
          {confirmed && missionPhase !== "complete" && missionPhase !== "idle" && (
            <div className="flex-1 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-700 shadow-lg flex items-center justify-center gap-2 min-w-0">
               <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                 missionPhase === "returning" ? 'bg-blue-400 animate-pulse' :
                 progress >= 30 ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'
               }`} />
               <span className="text-[11px] font-black text-white tracking-wide truncate">
                 {getStatusText()}
               </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* FLIR Thermal Camera Toggle */}
            <button 
              onClick={() => setShowFlirCam(!showFlirCam)}
              className={`px-3 py-2 rounded-full flex items-center gap-1 border shadow-sm backdrop-blur-md transition-all ${
                showFlirCam ? 'bg-amber-500 text-white border-amber-400 font-black' : 'bg-white/90 text-slate-800 border-slate-100 font-bold'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider">
                📷 FLIR
              </span>
            </button>

            {/* SAR Alert Status Pill */}
            <button 
              onClick={() => setPersonFoundAlert(!personFoundAlert)}
              className={`px-3 py-2 rounded-full flex items-center gap-1 border shadow-sm backdrop-blur-md transition-all ${
                personFoundAlert || progress >= 20 ? 'bg-red-600 text-white border-red-400 emergency-alert-glow' : 'bg-white/90 text-slate-800 border-slate-100'
              }`}
            >
               <span className="text-[10px] font-black uppercase tracking-wider">
                 {progress >= 20 ? "🚨 Person" : "SAR Unit"}
               </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 📷 FLIR THERMAL CAMERA HUD MODAL / VIEWFINDER */}
      <AnimatePresence>
        {showFlirCam && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed top-20 right-4 z-[10003] w-72 bg-slate-950/95 border border-amber-500/60 rounded-2xl p-3 text-white shadow-2xl backdrop-blur-xl pointer-events-auto overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest">FLIR THERMAL OPTIC</span>
              </div>
              <button 
                onClick={() => setShowFlirCam(false)}
                className="text-slate-400 hover:text-white text-[11px]"
              >
                ✕
              </button>
            </div>

            {/* Thermal Simulation View */}
            <div className="relative h-36 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />
              
              {/* Crosshair reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 border border-amber-400/60 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-red-500 rounded-lg animate-pulse flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  </div>
                </div>
                <div className="absolute w-full h-[1px] bg-amber-400/20"></div>
                <div className="absolute h-full w-[1px] bg-amber-400/20"></div>
              </div>

              {/* Heat signature silhouette */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-t from-red-500 via-amber-400 to-yellow-300 blur-[2px] flex items-center justify-center opacity-90 animate-pulse">
                  <span className="text-[9px] font-black text-slate-950">37.2°C</span>
                </div>
                <span className="text-[8px] font-mono font-black text-amber-300 bg-slate-900/80 px-1.5 py-0.5 rounded mt-1 border border-amber-400/40">
                  HUMAN DETECTED
                </span>
              </div>

              <div className="absolute top-1.5 left-2 text-[8px] font-mono text-emerald-400">
                ZOOM: 4.2X • FLIR IR
              </div>
              <div className="absolute bottom-1.5 right-2 text-[8px] font-mono text-amber-400">
                ALT: {progress > 10 && progress < 95 ? "40m" : progress >= 95 ? "5m" : "0m"}
              </div>
            </div>

            <div className="mt-2 text-[10px] font-mono text-slate-300 flex justify-between">
              <span>TARGET CONFIDENCE:</span>
              <span className="text-emerald-400 font-bold">98.8% MATCH</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚨 PERSON FOUND EMERGENCY POPUP NOTIFICATION */}
      <AnimatePresence>
        {personFoundAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[10002] w-full max-w-md px-4 pointer-events-auto"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-red-500/80 rounded-2xl p-4 text-white shadow-[0_10px_40px_rgba(239,68,68,0.35)] overflow-hidden relative">
              {/* Radar pulse background element */}
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-red-500/20 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/50 flex-shrink-0 animate-pulse">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-black uppercase tracking-wider mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                      AI Thermal Detection Lock
                    </div>
                    <h3 className="text-[16px] font-black tracking-tight text-white flex items-center gap-2">
                      PERSON LOCATED
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">98.8% MATCH</span>
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => { setPersonFoundAlert(false); setAlertDismissed(true) }}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 bg-slate-950/60 rounded-xl p-3 border border-white/5 flex flex-col gap-1.5 text-[12px]">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span className="text-slate-400">Target Coordinates:</span>
                  <span className="font-mono text-white font-bold">{droneLocation?.lat ? droneLocation.lat.toFixed(6) : "30.015427"}° N, {droneLocation?.lng ? droneLocation.lng.toFixed(6) : "78.222404"}° E</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span className="text-slate-400">Target Status:</span>
                  <span className="text-amber-400 font-bold">Survivor in distress • Stationary</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span className="text-slate-400">Response Action:</span>
                  <span className="text-emerald-400 font-bold">Deploying Medical Aid Payload 🧰</span>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                <button
                  onClick={() => { setPersonFoundAlert(false); setAlertDismissed(true) }}
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-[12px] rounded-xl shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>Auto-Deploying Medical Aid Payload...</span>
                </button>
                <div className="h-1 bg-red-950 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DELIVERING MEDICAL PAYLOAD HUD ──────────────────────── */}
      <AnimatePresence>
        {missionPhase === "delivering" && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[10002] w-full max-w-sm px-4 pointer-events-none"
          >
            <div className="bg-slate-950/95 backdrop-blur-xl border-2 border-red-500/80 rounded-2xl p-4 text-white shadow-[0_10px_40px_rgba(239,68,68,0.4)] text-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[11px] font-black uppercase tracking-widest text-red-400">WINCH DROP IN PROGRESS</span>
              </div>
              <h4 className="text-[15px] font-black text-white flex items-center justify-center gap-1.5">
                <span>Deploying Medical Aid Payload</span>
                <span>🧰</span>
              </h4>
              <p className="text-[11px] text-slate-300 font-medium mt-1">Autonomous winch lowering trauma kit (5.0m hold above survivor)</p>
              
              {/* Delivery animated progress bar */}
              <div className="mt-3 h-2 bg-slate-900 rounded-full overflow-hidden border border-red-500/40 p-0.5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 7, ease: "linear" }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[9px] font-mono text-slate-400">
                <span>ALTITUDE: 5.0m</span>
                <span className="text-emerald-400 font-bold">RELEASE LOCK: ENGAGED</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RETURNING TO BASE HUD ──────────────────────── */}
      <AnimatePresence>
        {missionPhase === "returning" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[10002] w-full max-w-sm px-4 pointer-events-none"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/50 rounded-2xl p-4 text-white shadow-[0_8px_30px_rgba(59,130,246,0.25)] text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-blue-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
                <span className="text-[11px] font-black uppercase tracking-widest text-blue-300">Returning to Base</span>
              </div>
              <p className="text-[13px] font-bold text-white">Medical aid deployed successfully</p>
              <p className="text-[10px] text-slate-400 mt-1">Drone ascending & RTB autopilot engaged</p>
              
              {/* Return progress bar */}
              <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 12, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND MAP — passes ports, selectedPort and showPersonFound */}
      <div className="absolute inset-0 z-0">
        <Map
          droneLocation={droneLocation}
          userLocation={userLocation}
          showPath={showPath && missionPhase !== "complete"}
          ports={skylinkPorts}
          selectedPort={selectedPort}
          showPersonFound={progress >= 70 || missionPhase === "delivering" || missionPhase === "returning" || missionPhase === "complete"}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] map-gradient-overlay" />

      {/* FLOATING CARD */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-lg px-2 sm:px-4 pointer-events-none">
        <FloatingInfoCard
          loading={loading}
          booked={booked}
          confirmed={confirmed}
          progress={getCardProgress()}
          isDelivering={getCardIsDelivering()}
          onAction={handleAction}
          orderItems={orderItems}
          selectedPort={selectedPort}
          orderId={currentOrderId}
          missionPhase={missionPhase}
        />
      </div>
    </div>
  )
}

export default Tracking
