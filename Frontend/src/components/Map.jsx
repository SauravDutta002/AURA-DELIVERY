


// // import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
// // import "leaflet/dist/leaflet.css"
// // import L from "leaflet"
// // import DroneIcon from "../assets/icons/Drone_Icon.png"
// // import { useEffect } from "react"

// // // Fix default marker icon issue
// // delete L.Icon.Default.prototype._getIconUrl
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl:
// //     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
// //   iconUrl:
// //     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
// //   shadowUrl:
// //     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// // })

// // // 🏠 Home Icon
// // const homePin = new L.Icon({
// //   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
// //   iconSize: [42, 42],
// //   iconAnchor: [21, 42],
// // })

// // // 📍 User Icon
// // const livePin = new L.Icon({
// //   iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
// //   iconSize: [42, 42],
// //   iconAnchor: [21, 42],
// // })

// // // 🚁 Drone Icon
// // const dronePin = new L.Icon({
// //   iconUrl: DroneIcon,
// //   iconSize: [48, 48],
// //   iconAnchor: [24, 24],
// // })

// // // 📡 Auto-center on drone
// // const RecenterMap = ({ dronePos }) => {
// //   const map = useMap()

// //   useEffect(() => {
// //     if (dronePos) {
// //       map.setView(dronePos, 56)
// //     }
// //   }, [dronePos, map])

// //   return null
// // }

// // const Map = ({ droneLocation, userLocation }) => {
// //   const home = [30.7695, 76.577523]

// //   const dronePos = droneLocation
// //     ? [droneLocation.lat, droneLocation.lng]
// //     : null

// //   const userPos = userLocation
// //     ? [userLocation.lat, userLocation.lng]
// //     : null

// //   return (
// //     <div className="h-screen w-full rounded-2xl overflow-hidden shadow-2xl">
// //       <MapContainer
// //         center={home}
// //         zoom={16}
// //         className="h-full w-full"
// //       >
// //           {/* // google maps  */}
// //          {/* <TileLayer
// //           url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
// //         /> */}

        
// //         <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

// //         {/* 🏠 Base */}
// //         <Marker position={home} icon={homePin} />

// //         {/* 📍 User */}
// //         {userPos && (
// //           <Marker position={userPos} icon={livePin} />
// //         )}

// //         {/* 🚁 Drone */}
// //         {dronePos && (
// //           <>
// //             <Marker position={dronePos} icon={dronePin} />
// //             <RecenterMap dronePos={dronePos} />
// //           </>
// //         )}

// //         {/* ✈ Line drone → user */}
// //         {dronePos && userPos && (
// //           <Polyline
// //             positions={[dronePos, userPos]}
// //             pathOptions={{
// //               color: "#000",
// //               weight: 2,
// //               dashArray: "6 6",
// //             }}
// //           />
// //         )}
// //       </MapContainer>
// //     </div>
// //   )
// // }

// // export default Map


// import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
// import "leaflet/dist/leaflet.css"
// import L from "leaflet"
// import DroneIcon from "../assets/icons/Drone_Icon.png"
// import { useEffect, useRef } from "react"

// /* ================= ICON FIX ================= */
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// })

// /* ================= ICONS ================= */
// const homePin = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [42, 42],
//   iconAnchor: [21, 42],
// })

// const livePin = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
//   iconSize: [42, 42],
//   iconAnchor: [21, 42],
// })

// const dronePin = new L.Icon({
//   iconUrl: DroneIcon,
//   iconSize: [48, 48],
//   iconAnchor: [24, 24],
// })

// /* ================= SMART RECENTER ================= */
// const RecenterMap = ({ dronePos }) => {
//   const map = useMap()

//   const followRef = useRef(true)
//   const timerRef = useRef(null)
  
//   useEffect(() => {
//     if (!dronePos) return
    
//     const pauseFollow = () => {
//       followRef.current = false
      
//       if (timerRef.current) clearTimeout(timerRef.current)
        
//         timerRef.current = setTimeout(() => {
//           followRef.current = true
//           map.setView(dronePos , 90)
//         }, 5000)
//       }

//     // ONLY real user interactions
//     map.on("dragstart zoomstart", pauseFollow)

//     return () => {
//       map.off("dragstart zoomstart", pauseFollow)
//     }
//   }, [map])

//   // Drone tracking
//   useEffect(() => {
//     if (!dronePos) return
//     if (!followRef.current) return

//     map.flyTo(dronePos, map.getZoom(), {
//       duration: 1,
//     })
//   }, [dronePos, map])

//   return null
// }

// /* ================= MAIN MAP ================= */
// const Map = ({ droneLocation, userLocation }) => {
//   const home = [30.7695, 76.577523]

//   const dronePos = droneLocation
//     ? [droneLocation.lat, droneLocation.lng]
//     : null

//   const userPos = userLocation
//     ? [userLocation.lat, userLocation.lng]
//     : null

//   return (
//     <div className="h-screen w-full rounded-2xl overflow-hidden shadow-2xl">
//       <MapContainer center={home} zoom={16} className="h-full w-full">

//         <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

//         {/* Home */}
//         <Marker position={home} icon={homePin} />

//         {/* User */}
//         {userPos && <Marker position={userPos} icon={livePin} />}

//         {/* Drone */}
//         {dronePos && (
//           <>
//             <Marker position={dronePos} icon={dronePin} />
//             <RecenterMap dronePos={dronePos} />
//           </>
//         )}

//         {/* Line */}
//         {dronePos && userPos && (
//           <Polyline
//             positions={[dronePos, userPos]}
//             pathOptions={{
//               color: "#000",
//               weight: 2,
//               dashArray: "6 6",
//             }}
//           />
//         )}

//       </MapContainer>
//     </div>
//   )
// }

// export default Map


import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import DroneIcon from "../assets/icons/Drone_Icon.png"
import { useEffect, useRef } from "react"

/* ICON FIX */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

/* ICONS */
const homePin=new L.Icon({
  iconUrl:"https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize:[42,42],
  iconAnchor:[21,42],
})

const livePin=new L.Icon({
  iconUrl:"https://cdn-icons-png.flaticon.com/512/149/149059.png",
  iconSize:[42,42],
  iconAnchor:[21,42],
})

const dronePin=new L.Icon({
  iconUrl:DroneIcon,
  iconSize:[48,48],
  iconAnchor:[24,24],
})

/* SMART RECENTER */
const RecenterMap=({dronePos})=>{
  const map=useMap()
  const followRef=useRef(true)
  const timerRef=useRef(null)

  useEffect(()=>{
    if(!dronePos) return

    const pauseFollow=()=>{
      followRef.current=false

      if(timerRef.current) clearTimeout(timerRef.current)

      timerRef.current=setTimeout(()=>{
        followRef.current=true
        map.setView(dronePos,30)
      },5000)
    }

    map.on("dragstart zoomstart",pauseFollow)
    return()=>map.off("dragstart zoomstart",pauseFollow)
  },[map,dronePos])

  useEffect(()=>{
    if(dronePos && followRef.current){
      map.flyTo(dronePos,map.getZoom(),{duration:1})
    }
  },[dronePos,map])

  return null
}

/* MAIN MAP */
// const Map=({droneLocation,userLocation,showPath})=>{
//   const home=[30.7695,76.577523]

//   const dronePos=droneLocation
//     ? [droneLocation.lat,droneLocation.lng]
//     : null

//   const userPos=userLocation
//     ? [userLocation.lat,userLocation.lng]
//     : null

//   return(
//     <div className="h-screen w-full rounded-2xl overflow-hidden shadow-2xl">
//       <MapContainer center={home} zoom={16} className="h-full w-full">

//         <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"/>

//         <Marker position={home} icon={homePin}/>

//         {userPos && <Marker position={userPos} icon={livePin}/>}

//         {dronePos && (
//           <>
//             <Marker position={dronePos} icon={dronePin}/>
//             <RecenterMap dronePos={dronePos}/>
//           </>
//         )}

//         {/* PATH ONLY WHEN showPath === true */}
//         {showPath && dronePos && userPos && (
//           <Polyline
//             positions={[dronePos,userPos]}
//             pathOptions={{
//               color:"#000",
//               weight:2,
//               dashArray:"6 6",
//             }}
//           />
//         )}

//       </MapContainer>
//     </div>
//   )
// }


const Map = ({ droneLocation, userLocation, showPath }) => {

  const dronePos = droneLocation
    ? [droneLocation.lat, droneLocation.lng]
    : null

  const userPos = userLocation
    ? [userLocation.lat, userLocation.lng]
    : null

  return (
    <MapContainer center={[30.7695,76.577523]} zoom={16} className="h-full w-full">

      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"/>

      {userPos && <Marker position={userPos} icon={livePin}/>}

      {dronePos && 
      <>
      <Marker position={dronePos} icon={dronePin}/>
       <RecenterMap dronePos={userLocation}/>
      </>}

      {showPath && dronePos && userPos && (
        <Polyline
          positions={[dronePos,userPos]}
          pathOptions={{color:"#000",weight:2,dashArray:"6 6"}}
        />

        // <Polyline positions={[dronePos,userPos]} />
      )}

    </MapContainer>
  )
}


export default Map
