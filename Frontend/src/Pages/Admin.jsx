import React, { useEffect, useState } from "react"
import Map from "../components/Map"
import { FiNavigation, FiMapPin, FiActivity, FiServer, FiWifi } from "react-icons/fi"

const API_URL = "https://aura-delivery-zmug.onrender.com"
const API_KEY = "SUPER_SECRET_KEY"
const DRONE_ID = "DRONE001"

const Admin = () => {
  const [droneLocation, setDroneLocation] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [status, setStatus] = useState(null)
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statusRes = await fetch(`${API_URL}/drone/${DRONE_ID}`)
        if (statusRes.ok) {
          const statusData = await statusRes.json()
          setStatus(statusData)
          if (statusData.userLat && statusData.userLng) {
            setUserLocation({ lat: statusData.userLat, lng: statusData.userLng })
          } else {
            setUserLocation(null)
          }
        }

        const telemetryRes = await fetch(`${API_URL}/telemetry/latest/${DRONE_ID}`, {
          headers: { "x-api-key": API_KEY }
        })
        if (telemetryRes.ok) {
          const telemetryData = await telemetryRes.json()
          if (telemetryData && telemetryData.lat && telemetryData.lon) {
            setDroneLocation({ lat: telemetryData.lat, lng: telemetryData.lon })
          }
          setIsConnected(true)
        } else {
          setIsConnected(false)
        }
      } catch (err) {
        console.error("Admin data fetch error:", err)
        setIsConnected(false)
      }
    }

    fetchAdminData()
    const interval = setInterval(fetchAdminData, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-[#ededed] font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* SIDEBAR: Ultra-premium dark mode (Linear style) */}
      <div className="w-[340px] bg-[#09090b] border-r border-[#27272a] flex flex-col z-10">
        
        {/* HEADER */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-[#27272a]">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-[4px] bg-[#ededed] text-[#09090b] flex items-center justify-center">
              <FiServer size={12} strokeWidth={3} />
            </div>
            <h1 className="text-[13px] font-semibold tracking-wide">AURA Ops Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-[#a1a1aa]">SYS</span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#10b981] shadow-[0_0_8px_#10b98180]' : 'bg-[#ef4444] shadow-[0_0_8px_#ef444480]'}`} />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-8">
          
          {/* Mission State */}
          <section>
            <h2 className="text-[10px] font-semibold text-[#71717a] uppercase tracking-widest mb-3">Vehicle State</h2>
            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-[#a1a1aa] font-medium">Status</span>
                <div className="flex items-center gap-2 px-2 py-1 bg-[#27272a] rounded-[4px]">
                  <FiActivity size={12} className={status?.confirmed ? 'text-[#3b82f6]' : status?.booked ? 'text-[#f59e0b]' : 'text-[#71717a]'} />
                  <span className="text-[11px] font-semibold tracking-wide text-[#ededed]">
                    {status?.confirmed ? "IN TRANSIT" : status?.booked ? "STANDBY" : "IDLE"}
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#27272a] h-[1px] mb-4" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#a1a1aa] font-medium">Vehicle ID</span>
                <span className="text-[13px] font-mono text-[#ededed]">{DRONE_ID}</span>
              </div>
            </div>
          </section>

          {/* Telemetry */}
          <section>
            <h2 className="text-[10px] font-semibold text-[#71717a] uppercase tracking-widest mb-3 flex items-center gap-2">
              <FiWifi size={10} /> Live Telemetry
            </h2>
            
            {/* Drone GPS */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-lg mb-4 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#27272a] bg-[#1f1f22] flex items-center gap-2">
                <FiNavigation size={12} className="text-[#a1a1aa]" />
                <h3 className="text-[12px] font-medium text-[#ededed]">Current Coordinates</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-[#71717a] font-medium uppercase tracking-wider mb-1">Latitude</p>
                  <p className="text-[13px] font-mono text-[#ededed]">{droneLocation?.lat?.toFixed(6) || "WAITING"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#71717a] font-medium uppercase tracking-wider mb-1">Longitude</p>
                  <p className="text-[13px] font-mono text-[#ededed]">{droneLocation?.lng?.toFixed(6) || "WAITING"}</p>
                </div>
              </div>
            </div>

            {/* User GPS */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#27272a] bg-[#1f1f22] flex items-center gap-2">
                <FiMapPin size={12} className="text-[#a1a1aa]" />
                <h3 className="text-[12px] font-medium text-[#ededed]">Target Destination</h3>
              </div>
              <div className="p-4">
                {userLocation ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-[#71717a] font-medium uppercase tracking-wider mb-1">Latitude</p>
                      <p className="text-[13px] font-mono text-[#ededed]">{userLocation.lat?.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#71717a] font-medium uppercase tracking-wider mb-1">Longitude</p>
                      <p className="text-[13px] font-mono text-[#ededed]">{userLocation.lng?.toFixed(6)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[12px] text-[#71717a] font-medium">No active target destination.</p>
                )}
              </div>
            </div>
          </section>

          {/* Quick Data */}
          <section className="mt-auto">
             <div className="flex items-center justify-between text-[11px] font-medium text-[#71717a] px-1">
               <span>Data Link</span>
               <span className="text-[#10b981]">Encrypted</span>
             </div>
             <div className="flex items-center justify-between text-[11px] font-medium text-[#71717a] px-1 mt-2">
               <span>Polling Rate</span>
               <span className="text-[#ededed]">2000ms</span>
             </div>
          </section>

        </div>
      </div>

      {/* MAP AREA */}
      <div className="flex-1 relative bg-[#18181b] z-0 border-l border-[#27272a]">
        <Map
          droneLocation={droneLocation}
          userLocation={userLocation}
          showPath={false}
          ports={[]}
        />
        {/* Sleek vignette overlay to blend map edges into dark theme */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_#09090b] z-10" />
      </div>

    </div>
  )
}

export default Admin
