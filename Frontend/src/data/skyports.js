// ═══════════════════════════════════════════════════════════════
//  SKYLINK PORTS — Predefined drone landing zones
//  Users collect their packages from the nearest port
// ═══════════════════════════════════════════════════════════════

export const skylinkPorts = [
  {
    id: "SKL-01",
    name: "SkyLink Central",
    address: "Main Delivery Hub",
    lat: 30.0133633,
    lng: 78.2210714,
  },
  {
    id: "SKL-02",
    name: "SkyLink Campus",
    address: "University Gate, North Side",
    lat: 30.0140000,
    lng: 78.2220000,
  },
  {
    id: "SKL-03",
    name: "SkyLink Market",
    address: "Sector Market, South Wing",
    lat: 30.0125000,
    lng: 78.2200000,
  },
  {
    id: "SKL-04",
    name: "SkyLink Park",
    address: "Community Park Entrance",
    lat: 30.0155000,
    lng: 78.2195000,
  },
  {
    id: "SKL-05",
    name: "SkyLink Tower",
    address: "IT Tower Complex",
    lat: 30.0120000,
    lng: 78.2230000,
  },
  {
    id: "SKL-06",
    name: "SkyLink Station",
    address: "Railway Crossing, East Side",
    lat: 30.0110000,
    lng: 78.2180000,
  },
  {
    id: "SKL-07",
    name: "SkyLink Hub",
    address: "Industrial Area, Block A",
    lat: 30.0160000,
    lng: 78.2225000,
  },
  {
    id: "SKL-08",
    name: "SkyLink Square",
    address: "Shopping Complex, West Gate",
    lat: 30.0135000,
    lng: 78.2190000,
  },
]

/**
 * Find the nearest SkyLink Port to a given lat/lng
 * Uses Haversine formula for accuracy
 */
export const findNearestPort = (userLat, userLng) => {
  if (!userLat || !userLng) return skylinkPorts[0]

  let nearest = skylinkPorts[0]
  let minDist = Infinity

  for (const port of skylinkPorts) {
    const d = haversine(userLat, userLng, port.lat, port.lng)
    if (d < minDist) {
      minDist = d
      nearest = port
    }
  }

  return { ...nearest, distance: minDist }
}

/** Haversine distance in meters */
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
