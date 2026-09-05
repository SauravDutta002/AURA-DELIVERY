// ═══════════════════════════════════════════════════════════════
//  SEARCH & RESCUE TARGET GRIDS — Coordinates for medical drone drops
// ═══════════════════════════════════════════════════════════════

export const skylinkPorts = [
  {
    id: "SKL-02",
    name: "SAR Sector Alpha — Victim LZ",
    address: "North Trail Ridge (Coordinates Locked)",
    lat: 30.0133633,
    lng: 78.2210714,
  },
  {
    id: "SKL-03",
    name: "SAR Sector Bravo — River Valley",
    address: "South Bank Gorge Area",
    lat: 30.0125000,
    lng: 78.2200000,
  },
  {
    id: "SKL-04",
    name: "SAR Sector Charlie — Ridge Camp",
    address: "Mountain Pass Waypoint",
    lat: 30.0155000,
    lng: 78.2195000,
  },
  {
    id: "SKL-05",
    name: "SAR Sector Delta — Forest Grid 4",
    address: "East Woodland Clearance",
    lat: 30.0120000,
    lng: 78.2230000,
  },
  {
    id: "SKL-06",
    name: "SAR Sector Echo — Rail Corridor",
    address: "Perimeter Perimeter Outpost",
    lat: 30.0110000,
    lng: 78.2180000,
  },
  {
    id: "SKL-07",
    name: "SAR Sector Foxtrot — High Peak LZ",
    address: "Alpine Rescue Sector A",
    lat: 30.0160000,
    lng: 78.2225000,
  },
  {
    id: "SKL-08",
    name: "SAR Sector Golf — West Ravine",
    address: "West Canyon Extraction Point",
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
