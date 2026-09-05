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

// User / Command Center Dot
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

// Drone icon with animated radar beam & guaranteed DivIcon rendering
const dronePin = L.divIcon({
  className: "drone-leaflet-div-icon",
  html: `
    <div style="position: relative; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;">
      <!-- Radar scan pulse -->
      <div style="position: absolute; width: 56px; height: 56px; border-radius: 50%; background: rgba(59, 130, 246, 0.2); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; border: 1.5px dashed rgba(59, 130, 246, 0.7); animation: spin 4s linear infinite;"></div>
      
      <!-- Drone Icon Wrapper -->
      <div style="position: relative; z-index: 10; width: 44px; height: 44px; background: #0f172a; border: 2px solid #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.8);">
        <img src="${DroneIcon}" style="width: 28px; height: 28px; object-fit: contain;" alt="Drone" />
      </div>
      
      <!-- Status Tag -->
      <div style="position: absolute; bottom: -14px; white-space: nowrap; background: #2563eb; color: #ffffff; font-size: 8px; font-weight: 900; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.05em; border: 1px solid rgba(255,255,255,0.4); box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
        🛸 MED-DRONE SAR
      </div>
    </div>`,
  iconSize: [56, 56],
  iconAnchor: [28, 28],
})

// Person Found / Survivor Marker (Active Target)
const personFoundIcon = L.divIcon({
  className: "person-found-marker",
  html: `
    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
      <div class="person-target-beacon" style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(239, 68, 68, 0.4); border: 1.5px solid rgba(239, 68, 68, 0.8);"></div>
      <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(239, 68, 68, 0.2); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; z-index: 10; width: 34px; height: 34px; background: #dc2626; border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.6);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div style="position: absolute; bottom: -18px; white-space: nowrap; background: #0f172a; color: #fff; font-size: 8px; font-weight: 800; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.05em; border: 1px solid rgba(239,68,68,0.5); box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
        🚨 PERSON FOUND
      </div>
    </div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
})

// SkyLink Port / Search & Rescue Waypoint (Standard)
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


/* ================= SMART RECENTER ================= */
const RecenterMap = ({ dronePos, userPos, portPos, active, ports }) => {
  const map = useMap()
  const followRef = useRef(true)
  const timerRef = useRef(null)
  const prevActiveRef = useRef(active)

  const reframe = useCallback(() => {
    if (active && userPos && portPos) {
      // Active tracking: fit user + selected port (drone is always between them)
      const bounds = L.latLngBounds([userPos, portPos])
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
  }, [map, userPos, portPos, active, ports])

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
    // Only reframe when the static points or state changes, NOT 60x a second on dronePos
    if (followRef.current) reframe()
  }, [userPos ? userPos.join(',') : '', portPos ? portPos.join(',') : '', active, reframe])

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
const MapComponent = ({ droneLocation, userLocation, showPath, ports = [], selectedPort = null, showPersonFound = false }) => {
  const dronePos = droneLocation && typeof droneLocation.lat === "number" && typeof droneLocation.lng === "number" ? [droneLocation.lat, droneLocation.lng] : null
  const userPos = userLocation && typeof userLocation.lat === "number" && typeof userLocation.lng === "number" ? [userLocation.lat, userLocation.lng] : null
  const portPos = selectedPort && typeof selectedPort.lat === "number" && typeof selectedPort.lng === "number" ? [selectedPort.lat, selectedPort.lng] : null

  const displayPorts = (selectedPort ? [selectedPort] : ports).filter(
    (p) => p && typeof p.lat === "number" && typeof p.lng === "number"
  )

  return (
    <MapContainer
      center={[30.7640, 76.5723]}
      zoom={15}
      className="h-full w-full"
      scrollWheelZoom={true}
      dragging={true}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* User location */}
      {userPos && (
        <Marker position={userPos} icon={userDot}>
          <Popup className="skylink-popup" closeButton={false} autoPan={false}>
            <div style={{ textAlign: "center", fontFamily: "Inter, sans-serif", padding: "2px 0" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Your Location</p>
              <p style={{ fontSize: "9px", color: "#64748b", margin: "3px 0 0", fontWeight: 600, fontFamily: "monospace" }}>
                {userPos[0]?.toFixed(6)}, {userPos[1]?.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Drone */}
      {dronePos && <Marker position={dronePos} icon={dronePin} />}

      {/* SkyLink / SAR Target Zone - Person Found marker only appears when drone gets near */}
      {displayPorts.map((port) => {
        const isSelected = selectedPort && selectedPort.id === port.id
        const isDetected = isSelected && showPersonFound

        // Hide marker completely before detection if selected, or show standard port icon
        if (isSelected && !showPersonFound) return null

        return (
          <Marker
            key={port.id || `${port.lat}-${port.lng}`}
            position={[port.lat, port.lng]}
            icon={isDetected ? personFoundIcon : portIcon}
          >
            <Popup className="skylink-popup" closeButton={false} autoPan={false}>
              <div style={{ textAlign: "center", fontFamily: "Inter, sans-serif", padding: "4px 2px" }}>
                {isDetected ? (
                  <>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#fee2e2", padding: "2px 6px", borderRadius: "999px", marginBottom: "4px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#dc2626" }}></span>
                      <span style={{ fontSize: "9px", fontWeight: 800, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em" }}>Person Found • Survivor</span>
                    </div>
                    <p style={{ fontSize: "12px", fontWeight: 800, color: "#0f172a", margin: 0 }}>{port.name || "Target Search Grid"}</p>
                    <p style={{ fontSize: "9px", color: "#64748b", margin: "2px 0 0", fontWeight: 600 }}>Distress signal locked • Ready for medical aid</p>
                    <p style={{ fontSize: "8px", color: "#dc2626", margin: "3px 0 0", fontWeight: 700, fontFamily: "monospace" }}>{port.lat?.toFixed(7)}, {port.lng?.toFixed(7)}</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a", margin: 0 }}>{port.name}</p>
                    <p style={{ fontSize: "9px", color: "#94a3b8", margin: "2px 0 0", fontWeight: 500 }}>{port.address}</p>
                    <p style={{ fontSize: "8px", color: "#64748b", margin: "3px 0 0", fontWeight: 600, fontFamily: "monospace" }}>{port.lat?.toFixed(7)}, {port.lng?.toFixed(7)}</p>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}

      {/* Auto-recenter */}
      <RecenterMap dronePos={dronePos} userPos={userPos} portPos={portPos} active={showPath} ports={ports} />
    </MapContainer>
  )
}

export default MapComponent