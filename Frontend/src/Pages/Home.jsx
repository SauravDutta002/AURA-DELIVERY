// import React, { useEffect, useState } from "react"
// import Map from "../components/Map"
// import FloatingInfoCard from "../components/FloatingInfoCard"

// const Home = () => {
//   const [location, setLocation] = useState(null)

//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           })
//         },
//         (error) => {
//           console.error("Location Error:", error)
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//         }
//       )
//     } else {
//       console.error("Geolocation not supported")
//     }
//   }, [])

//   return (
//     <div className="relative bg-white h-screen">

//       {/* Map Layer */}
//       <div className="absolute inset-0 z-0">
//         <Map location={location} />
//       </div>

//       {/* Floating Card Layer */}
//       <div className="absolute top-6 left-6 z-10">
//         <FloatingInfoCard />
//       </div>

//     </div>
//   )
// }

// export default Home

// import React, { useEffect, useState } from "react"
// import Map from "../components/Map"
// import FloatingInfoCard from "../components/FloatingInfoCard"

// const API_URL = "https://aura-delivery-1.onrender.com"
// const API_KEY = "SUPER_SECRET_KEY"
// const DRONE_ID = "DRONE001"

// const Home = () => {
//   const [userLocation, setUserLocation] = useState(null)
//   const [droneLocation, setDroneLocation] = useState(null)

//   // 📍 Get User Location
//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           })
//         },
//         (error) => console.error("Location Error:", error),
//         { enableHighAccuracy: true, timeout: 10000 }
//       )
//     }
//   }, [])

//   // 🚁 Fetch Drone Location
//   const fetchDrone = async () => {
//     try {
//       const res = await fetch(
//         `${API_URL}/telemetry/latest/${DRONE_ID}`,
//         { headers: { "x-api-key": API_KEY } }
//       )

//       const data = await res.json()

//       if (data?.lat && data?.lon) {
//         setDroneLocation({
//           lat: data.lat,
//           lng: data.lon,
//         })

//         console.log("Drone:", data.lat, data.lon)
//       }
//     } catch (err) {
//       console.log("Drone fetch error", err)
//     }
//   }

//   useEffect(() => {
//     fetchDrone()
//     const interval = setInterval(fetchDrone, 2000) // every 2s
//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <div className="relative bg-white h-screen">

//       {/* 🗺 Map */}
//       <div className="absolute inset-0 z-0">
//         <Map
//           droneLocation={droneLocation}
//           userLocation={userLocation}
//         />
//       </div>

//       {/* 📦 Floating UI */}
//       <div className="absolute top-6 left-6 z-10">
//         <FloatingInfoCard />
//       </div>

//     </div>
//   )
// }

// export default Home


import React, { useEffect, useState } from "react"
import Map from "../components/Map"
import FloatingInfoCard from "../components/FloatingInfoCard"
import Loader from "../components/Loader"

const API_URL = "https://aura-delivery-1.onrender.com"
const API_KEY = "SUPER_SECRET_KEY"
const DRONE_ID = "DRONE001"

const Home = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [droneLocation, setDroneLocation] = useState(null)
  const [loading, setLoading] = useState(true)

  // 📍 Get User Location
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
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }
  }, [])

  // 🚁 Fetch Drone Location
  const fetchDrone = async () => {
    try {
      const res = await fetch(
        `${API_URL}/telemetry/latest/${DRONE_ID}`,
        { headers: { "x-api-key": API_KEY } }
      )

      const data = await res.json()

      if (data?.lat && data?.lon) {
        setDroneLocation({
          lat: data.lat,
          lng: data.lon,
        })
      }
    } catch (err) {
      console.log("Drone fetch error", err)
    }
  }

  useEffect(() => {
    fetchDrone()
    const interval = setInterval(fetchDrone, 2000)
    return () => clearInterval(interval)
  }, [])

  // 🧠 Smart Loading Control
  useEffect(() => {
    if (userLocation && droneLocation) {
      setLoading(false)
    }
  }, [userLocation, droneLocation])

  return (
    <div className="relative bg-white h-screen">

      {/* 🗺 Map */}
      <div className="absolute inset-0 z-0">
        <Map
          droneLocation={droneLocation}
          userLocation={userLocation}
        />
      </div>

      {/* 📦 Floating UI */}
      <div className="absolute top-6 left-6 z-10">
        <FloatingInfoCard />
      </div>

      {/* 🚁 Loader */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-end justify-center">
          <Loader />
        </div>
      )}

    </div>
  )
}

export default Home
