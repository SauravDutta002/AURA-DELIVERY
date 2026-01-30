import React, { useEffect, useState } from "react"
import Map from "../components/Map"
import FloatingInfoCard from "../components/FloatingInfoCard"

const Home = () => {
  const [location, setLocation] = useState(null)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Location Error:", error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      )
    } else {
      console.error("Geolocation not supported")
    }
  }, [])

  return (
    <div className="relative bg-white h-screen">

      {/* Map Layer */}
      <div className="absolute inset-0 z-0">
        <Map location={location} />
      </div>

      {/* Floating Card Layer */}
      <div className="absolute top-6 left-6 z-10">
        <FloatingInfoCard />
      </div>

    </div>
  )
}

export default Home