import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"
import L from "leaflet"
import "leaflet-routing-machine"
import { useEffect, useState } from "react"
import  DroneIcon  from "../assets/icons/Drone_Icon.png"
// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// 🏠 Home Icon
const homePin = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
})

// 📍 Live Location Icon
const livePin = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
})

// 🚁 Drone Icon
const dronePin = new L.Icon({
  iconUrl:DroneIcon,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
})

// 🛰 Smooth Camera Follow
const FlyToLocation = ({ location }) => {
  const map = useMap()

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 16, {
        animate: true,
        duration: 1.5,
      })
    }
  }, [location])

  return null
}

// 🛣 Routing Component (Extracts Road Path)
const Routing = ({ waypoints, setRoute }) => {
  const map = useMap()

  useEffect(() => {
    if (!map || !waypoints?.length) return

    const control = L.Routing.control({
      waypoints: waypoints.map((p) => L.latLng(p[0], p[1])),
      lineOptions: {
        styles: [{ color: "black", weight: 5, opacity: 0.9 }],
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      draggableWaypoints: false,
      createMarker: () => null,
    }).addTo(map)

    control.on("routesfound", function (e) {
      const coords = e.routes[0].coordinates.map((c) => [c.lat, c.lng])
      setRoute(coords)
    })

    return () => map.removeControl(control)
  }, [map, waypoints])

  return null
}

// 🚁 Animated Drone Movement
const AnimatedDrone = ({ route }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!route.length) return

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= route.length - 1) return prev
        return prev + 1
      })
    }, 70) // smaller = faster

    return () => clearInterval(interval)
  }, [route])

  if (!route.length) return null

  return <Marker position={route[index]} icon={dronePin} />
}

// 🗺 Main Map Component
const Map = ({ location }) => {
  const [route, setRoute] = useState([])

  // 🏠 Home Coordinates
  const home = [30.7695, 76.577523]

  // 🛣 Waypoints
  const waypoints = location
    ? [home, [location.lat, location.lng]]
    : [home]

  return (
    <div className="h-screen w-full rounded-2xl overflow-hidden shadow-2xl">
      <MapContainer
        center={home}
        zoom={16}
        scrollWheelZoom
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap & CARTO"
        /> 

        //! tile url for google like map

         {/* <TileLayer
          url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
        /> */}

        {location && <FlyToLocation location={location} />}

        {location && (
          <Routing waypoints={waypoints} setRoute={setRoute} />
        )}

        {/* 🏠 Home Marker */}
        <Marker position={home} icon={homePin} />

        {/* 📍 User Location */}
        {location && (
          <Marker
            position={[location.lat, location.lng]}
            icon={livePin}
          />
        )}

        {/* 🚁 Moving Drone */}
        {route.length > 0 && <AnimatedDrone route={route} />}
      </MapContainer>
    </div>
  )
}

export default Map