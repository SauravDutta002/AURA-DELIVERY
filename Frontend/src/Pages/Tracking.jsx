import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Map from "../components/Map"
import FloatingInfoCard from "../components/FloatingInfoCard"
import SimulationBadge from "../components/SimulationBadge"
import { useOrder } from "../context/OrderContext"
import { skylinkPorts, findNearestPort } from "../data/skyports"
import { motion } from "framer-motion"
import { FiArrowLeft } from "react-icons/fi"

const API_URL = "https://aura-delivery-zmug.onrender.com"
const API_KEY = "SUPER_SECRET_KEY"
const DRONE_ID = "DRONE001"

const Tracking = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [droneLocation, setDroneLocation] = useState({ lat: 30.777772, lng: 76.575884 })
  const [booked, setBooked] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showPath, setShowPath] = useState(false)
  const [selectedPort, setSelectedPort] = useState(null) // nearest SkyLink Port

  const { orderItems, placeOrder, orderPlaced, resetOrder, cart } = useOrder()
  const navigate = useNavigate()

  const syncLockRef = useRef(null)
  const autoBookedRef = useRef(false)

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

  // Auto-book removed: user must manually slide to book to assign the port and start tracking.

  /* FLIGHT SIMULATION LOOP */
  const animationRef = useRef(null)

  useEffect(() => {
    if (!confirmed || !selectedPort) return;

    const FLIGHT_DURATION_MS = 15000; // 15 seconds
    const DELAY_MS = 2000; // Wait 2 seconds before taking off
    const startPos = { lat: 30.777772, lng: 76.575884 };
    const endPos = { lat: selectedPort.lat, lng: selectedPort.lng };
    const startTime = Date.now() + DELAY_MS;

    const animate = () => {
      const now = Date.now();
      if (now < startTime) {
        animationRef.current = requestAnimationFrame(animate);
        return; // Wait until delay passes
      }

      const elapsed = now - startTime;
      let p = (elapsed / FLIGHT_DURATION_MS) * 100;

      if (p >= 100) {
        p = 100;
        setProgress(100);
        setDroneLocation({ lat: endPos.lat, lng: endPos.lng });
        return;
      }

      setProgress(p);
      const currentLat = startPos.lat + (endPos.lat - startPos.lat) * (p / 100);
      const currentLng = startPos.lng + (endPos.lng - startPos.lng) * (p / 100);
      setDroneLocation({ lat: currentLat, lng: currentLng });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [confirmed, selectedPort]);

  /* UNIFIED ACTION HANDLER */
  const handleAction = async (type) => {
    setLoading(true)
    const safetyTimer = setTimeout(() => setLoading(false), 6000)

    if (syncLockRef.current) clearTimeout(syncLockRef.current)
    syncLockRef.current = setTimeout(() => { syncLockRef.current = null }, 3000)

    // On book → calculate nearest port and bypass confirm state
    if (type === "book" && userLocation) {
      const nearest = findNearestPort(userLocation.lat, userLocation.lng)
      setSelectedPort(nearest)
      if (!orderPlaced) placeOrder()
    }

    let endpoint = ""
    if (type === "book") endpoint = "/drone/book"
    if (type === "confirm") endpoint = "/drone/confirm"
    if (type === "reset") endpoint = "/drone/reset"

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify({ droneId: DRONE_ID })
      })
      if (res.ok) {
        if (type === "book") {
          setBooked(true)
          setShowPath(true)
        }
        if (type === "confirm") setConfirmed(true)
        if (type === "reset") {
          setBooked(false)
          setConfirmed(false)
          setShowPath(false)
          setSelectedPort(null)
          setDroneLocation({ lat: 30.777772, lng: 76.575884 })
          setProgress(0)
          resetOrder()
        }
      }
    } catch (err) {
      console.error(`${type} action failed:`, err)
    } finally {
      clearTimeout(safetyTimer)
      setLoading(false)
    }
  }



  return (
    <div className="relative h-screen w-full bg-[#f8fafc] overflow-hidden">
      <SimulationBadge />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => { handleAction("reset"); navigate("/order") }}
        className="fixed top-4 left-4 z-[10001] w-10 h-10 bg-white/80 backdrop-blur-xl rounded-xl flex items-center justify-center border border-slate-100 shadow-card hover:bg-white transition-colors"
      >
        <FiArrowLeft size={16} className="text-slate-600" />
      </motion.button>


      {/* BACKGROUND MAP — passes ports and selectedPort */}
      <div className="absolute inset-0 z-0">
        <Map
          droneLocation={droneLocation}
          userLocation={userLocation}
          showPath={showPath && progress < 100}
          ports={skylinkPorts}
          selectedPort={selectedPort}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] map-gradient-overlay" />

      {/* FLOATING CARD */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-lg px-2 sm:px-4">
        <FloatingInfoCard
          loading={loading}
          booked={booked}
          confirmed={confirmed}
          progress={progress}
          onAction={handleAction}
          orderItems={orderItems}
          selectedPort={selectedPort}
        />
      </div>
    </div>
  )
}

export default Tracking
