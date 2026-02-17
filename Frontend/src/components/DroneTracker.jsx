import { useEffect, useState } from "react"
import Map from "./Map"

const API_URL = "https://aura-delivery-1.onrender.com"
const API_KEY = "SUPER_SECRET_KEY"
const DRONE_ID = "DRONE001"

export default function DroneTracker() {
  const [location, setLocation] = useState(null)

  const fetchLocation = async () => {
    try {
      const res = await fetch(
        `${API_URL}/telemetry/latest/${DRONE_ID}`,
        {
          headers: { "x-api-key": API_KEY },
        }
      )

      const data = await res.json()

      if (data?.lat && data?.lon) {
        setLocation({
          lat: data.lat,
          lng: data.lon,
        })

        console.log("Drone:", data.lat, data.lon)
      }
    } catch (err) {
      console.log("Fetch error", err)
    }
  }

  useEffect(() => {
    fetchLocation()

    const interval = setInterval(fetchLocation, 2000) // every 2s
    return () => clearInterval(interval)
  }, [])

  return <Map location={location} />
}
