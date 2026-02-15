import React from 'react'
import {Routes, Route } from "react-router-dom";
import Layout from './Layout/Layout';
import Home from './Pages/Home';
const App = () => {
  return (
    <Routes>
      <Route element ={<Layout/>}>
        <Route path='/' element={<Home/>}/>
      </Route>
    </Routes>
  )
}

export default App


// import { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";

// const API_URL = "https://aura-delivery-1.onrender.com";
// const API_KEY = "SUPER_SECRET_KEY";
// const DRONE_ID = "DRONE001";

// export default function DroneMap() {
//   const [points, setPoints] = useState([]);

//   const fetchRoute = async () => {
//     try {
//       const res = await fetch(
//         `${API_URL}/telemetry/route/${DRONE_ID}`,
//         {
//           headers: { "x-api-key": API_KEY }
//         }
//       );

//       const data = await res.json();

//       // ✅ Console log raw data
//       console.log("API Response:", data);

//       const coords = data.map(p => [p.lat, p.lon]);

//       // ✅ Console log coordinates
//       console.log("Coords:", coords);

//       setPoints(coords);

//     } catch (err) {
//       console.log("Fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchRoute();

//     const interval = setInterval(fetchRoute, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const lastPoint = points[points.length - 1];

//   return (
//     <MapContainer
//       center={lastPoint || [20, 77]}
//       zoom={13}
//       style={{ height: "100vh", width: "100%" }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {points.length > 0 && (
//         <>
//           <Polyline positions={points} color="red" />
//           <Marker position={lastPoint}>
//             <Popup>Drone Current Location 🚁</Popup>
//           </Marker>
//         </>
//       )}
//     </MapContainer>
//   );
// }
