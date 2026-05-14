import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import DroneIcon from "../assets/icons/Drone_Icon.png"
import { useEffect, useRef, useCallback } from "react"

/* ================= ICON FIX ================= */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

/* ================= ICONS ================= */

// User dot — black circle with pulsing ring
const userDot = L.divIcon({
  className: "leaflet-user-icon",
  html: `
    <div class="user-dot-wrapper">
      <div class="user-dot-pulse"></div>
      <div class="user-dot"></div>
    </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

// Drone icon
const dronePin = new L.Icon({
  iconUrl: DroneIcon,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
})

// SkyLink Port — Isometric Locker (grey)
const portIcon = L.divIcon({
  className: "skylink-port-icon",
  html: `
    <div class="port-locker">
      <svg width="24" height="28" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 6px 8px rgba(0,0,0,0.2));">
        <path d="M14 2 L26 8 L14 14 L2 8 Z" fill="#e2e8f0"/>
        <path d="M2 8 L14 14 V30 L2 24 Z" fill="#64748b"/>
        <path d="M14 14 L26 8 V24 L14 30 Z" fill="#94a3b8"/>
        <!-- Screen -->
        <path d="M15.5 14.5 L24.5 10 V14 L15.5 18.5 Z" fill="#cbd5e1"/>
        <!-- Dispense Slot -->
        <path d="M15.5 22 L24.5 17.5 V21 L15.5 25.5 Z" fill="#475569"/>
      </svg>
    </div>`,
  iconSize: [24, 28],
  iconAnchor: [12, 20],
})

// SkyLink Port — Isometric Locker (active)
const portIconActive = L.divIcon({
  className: "skylink-port-icon-active",
  html: `
    <div class="port-locker-active">
       <div class="port-pulse"></div>
       <svg width="32" height="36" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 8px 16px rgba(239, 68, 68, 0.5)); position: relative; z-index: 2;">
         <path d="M14 2 L26 8 L14 14 L2 8 Z" fill="#fee2e2"/>
         <path d="M2 8 L14 14 V30 L2 24 Z" fill="#dc2626"/>
         <path d="M14 14 L26 8 V24 L14 30 Z" fill="#ef4444"/>
         <!-- Glowing Screen -->
         <path d="M15.5 14.5 L24.5 10 V14 L15.5 18.5 Z" fill="#ffffff"/>
         <!-- Dispense Slot -->
         <path d="M15.5 22 L24.5 17.5 V21 L15.5 25.5 Z" fill="#7f1d1d"/>
       </svg>
    </div>`,
  iconSize: [32, 36],
  iconAnchor: [16, 27],
})

/* ================= SMART RECENTER ================= */
const RecenterMap = ({ dronePos, userPos, portPos, active, ports }) => {
  const map = useMap()
  const followRef = useRef(true)
  const timerRef = useRef(null)
  const prevActiveRef = useRef(active)

  const reframe = useCallback(() => {
    if (active && dronePos && portPos) {
      // Active tracking: fit drone + selected port
      const bounds = L.latLngBounds([dronePos, portPos])
      if (userPos) bounds.extend(userPos)
      map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 16, duration: 1.2 })
    } else if (ports && ports.length > 0 && userPos) {
      // Before confirm: fit user + all ports
      const allPoints = ports.map((p) => [p.lat, p.lng])
      allPoints.push(userPos)
      const bounds = L.latLngBounds(allPoints)
      map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 15.5, duration: 1.2 })
    } else if (userPos) {
      map.flyTo(userPos, 15, { duration: 1 })
    }
  }, [map, dronePos, userPos, portPos, active, ports])

  useEffect(() => {
    if (prevActiveRef.current && !active && userPos) {
      followRef.current = true
      map.flyTo(userPos, 15, { duration: 1 })
    }
    prevActiveRef.current = active
  }, [active, userPos, map])

  useEffect(() => {
    const pauseFollow = () => {
      followRef.current = false
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        followRef.current = true
        reframe()
      }, 3000)
    }
    map.on("dragstart zoomstart", pauseFollow)
    return () => map.off("dragstart zoomstart", pauseFollow)
  }, [map, reframe])

  useEffect(() => {
    if (followRef.current) reframe()
  }, [dronePos, userPos, portPos, reframe])

  return null
}

/* ================= ANIMATED PATH ================= */
const AnimatedPath = ({ from, to }) => {
  const dashRef = useCallback((node) => {
    if (node) {
      const el = node.getElement()
      if (el) el.classList.add("animated-path")
    }
  }, [])

  return (
    <>
      <Polyline positions={[from, to]} pathOptions={{ color: "#000", weight: 6, opacity: 0.1 }} />
      <Polyline ref={dashRef} positions={[from, to]} pathOptions={{ color: "#111", weight: 2.5, dashArray: "10 14", lineCap: "round" }} />
    </>
  )
}

/* ================= MAIN MAP ================= */
const MapComponent = ({ droneLocation, userLocation, showPath, ports = [], selectedPort = null }) => {
  const dronePos = droneLocation ? [droneLocation.lat, droneLocation.lng] : null
  const userPos = userLocation ? [userLocation.lat, userLocation.lng] : null
  const portPos = selectedPort ? [selectedPort.lat, selectedPort.lng] : null

  return (
    <MapContainer
      center={[30.7640, 76.5723]}
      zoom={15}
      className="h-full w-full"
      scrollWheelZoom={true}
      dragging={true}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

      {/* User location */}
      {userPos && (
        <Marker position={userPos} icon={userDot}>
          <Popup className="skylink-popup" closeButton={false} autoPan={false}>
            <div style={{ textAlign: "center", fontFamily: "Inter, sans-serif", padding: "2px 0" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Your Location</p>
              <p style={{ fontSize: "9px", color: "#64748b", margin: "3px 0 0", fontWeight: 600, fontFamily: "monospace" }}>
                {userPos[0].toFixed(6)}, {userPos[1].toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Drone */}
      {dronePos && <Marker position={dronePos} icon={dronePin} />}

      {/* SkyLink Ports */}
      {(selectedPort ? [selectedPort] : ports).map((port) => {
        const isSelected = selectedPort && selectedPort.id === port.id
        return (
          <Marker
            key={port.id}
            position={[port.lat, port.lng]}
            icon={isSelected ? portIconActive : portIcon}
          >
            <Popup className="skylink-popup" closeButton={false} autoPan={false}>
              <div style={{ textAlign: "center", fontFamily: "Inter, sans-serif", padding: "2px 0" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a", margin: 0 }}>{port.name}</p>
                <p style={{ fontSize: "9px", color: "#94a3b8", margin: "2px 0 0", fontWeight: 500 }}>{port.address}</p>
                <p style={{ fontSize: "8px", color: "#64748b", margin: "3px 0 0", fontWeight: 600, fontFamily: "monospace" }}>{port.lat.toFixed(7)}, {port.lng.toFixed(7)}</p>
                {isSelected && (
                  <p style={{ fontSize: "8px", color: "#ef4444", margin: "3px 0 0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>● Selected Port</p>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}

      {/* Auto-recenter */}
      <RecenterMap dronePos={dronePos} userPos={userPos} portPos={portPos} active={showPath} ports={ports} />

      {/* Animated path: drone → selected port */}
      {showPath && dronePos && portPos && (
        <AnimatedPath from={dronePos} to={portPos} />
      )}
    </MapContainer>
  )
}

export default MapComponent