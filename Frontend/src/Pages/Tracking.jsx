import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Map from "../components/Map"
import FloatingInfoCard from "../components/FloatingInfoCard"
import { useOrder } from "../context/OrderContext"
import { skylinkPorts, findNearestPort } from "../data/skyports"
import { motion } from "framer-motion"
import { FiArrowLeft } from "react-icons/fi"

const API_URL = "https://aura-delivery-zmug.onrender.com"
const API_KEY = "SUPER_SECRET_KEY"
const DRONE_ID = "DRONE001"

const Tracking = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [droneLocation, setDroneLocation] = useState({ lat: 30.0112224, lng: 78.2217014 })
  const [booked, setBooked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura_tracking_booked")) || false } catch { return false }
  })
  const [confirmed, setConfirmed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura_tracking_confirmed")) || false } catch { return false }
  })
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showPath, setShowPath] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura_tracking_showPath")) || false } catch { return false }
  })
  const [selectedPort, setSelectedPort] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura_tracking_port")) || null } catch { return null }
  })

  useEffect(() => { localStorage.setItem("aura_tracking_booked", JSON.stringify(booked)) }, [booked])
  useEffect(() => { localStorage.setItem("aura_tracking_confirmed", JSON.stringify(confirmed)) }, [confirmed])
  useEffect(() => { localStorage.setItem("aura_tracking_showPath", JSON.stringify(showPath)) }, [showPath])
  useEffect(() => { localStorage.setItem("aura_tracking_port", JSON.stringify(selectedPort)) }, [selectedPort])

  const { orderItems, placeOrder, orderPlaced, resetOrder, cart, currentOrderId } = useOrder()
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

  /* MOCK SIMULATION POLLING */
  useEffect(() => {
    if (!confirmed || !selectedPort) return;

    const startPos = { lat: 30.0112224, lng: 78.2217014 };
    const endPos = { lat: selectedPort.lat, lng: selectedPort.lng };
    let animationFrame;
    let startTime;
    let timeout1;
    let timeout2;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const duration = 15000; // 15 seconds to travel from 56% to 100%

      // Jump to 56% instantly, then interpolate to 100%
      let currentSimProgress = 56 + (elapsed / duration) * 44; 

      if (currentSimProgress >= 99.9) {
        currentSimProgress = 99.9;
        const p = currentSimProgress / 100;
        setDroneLocation({
          lat: startPos.lat + (endPos.lat - startPos.lat) * p,
          lng: startPos.lng + (endPos.lng - startPos.lng) * p,
        });
        setProgress(99.9);
        
        // Wait 2 seconds at the destination before showing Delivery Complete (100%)
        timeout2 = setTimeout(() => {
           setDroneLocation(endPos);
           setProgress(100);
        }, 2000);
        return; // Stop animation loop
      }

      const p = currentSimProgress / 100;
      setDroneLocation({
        lat: startPos.lat + (endPos.lat - startPos.lat) * p,
        lng: startPos.lng + (endPos.lng - startPos.lng) * p,
      });
      setProgress(currentSimProgress);

      animationFrame = requestAnimationFrame(animate);
    };

    // 1. Wait 2 seconds after confirm (Assigning Drone phase)
    timeout1 = setTimeout(() => {
      // 2. Jump to 56% and start following the path
      setProgress(56);
      animationFrame = requestAnimationFrame(animate);
    }, 2000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      if (animationFrame) cancelAnimationFrame(animationFrame);
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
      const bodyPayload = { droneId: DRONE_ID };
      if (type === "book" && userLocation) {
        bodyPayload.userLat = userLocation.lat;
        bodyPayload.userLng = userLocation.lng;
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify(bodyPayload)
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
          setDroneLocation({ lat: 30.0112224, lng: 78.2217014 })
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
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-lg px-2 sm:px-4 pointer-events-none">
        <FloatingInfoCard
          loading={loading}
          booked={booked}
          confirmed={confirmed}
          progress={progress}
          onAction={handleAction}
          orderItems={orderItems}
          selectedPort={selectedPort}
          orderId={currentOrderId}
        />
      </div>
    </div>
  )
}

export default Tracking
