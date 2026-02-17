import React,{useState} from "react"

// const API_URL="https://aura-delivery-1.onrender.com"
const API_URL="http://localhost:5000"
const API_KEY="SUPER_SECRET_KEY"
const DRONE_ID="DRONE001"

const FloatingInfoCard=({onBooked})=>{

  const [booked,setBooked]=useState(false)
  const [confirmed,setConfirmed]=useState(false)
  const [loading,setLoading]=useState(false)

  /* BOOK DRONE */
  const bookDrone=async()=>{
    setLoading(true)

    await fetch(`${API_URL}/order/book`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "x-api-key":API_KEY
      },
      body:JSON.stringify({droneId:DRONE_ID})
    })

    setLoading(false)
    setBooked(true)
    onBooked && onBooked()
  }

  /* CONFIRM */
  const confirmOrder=async()=>{
    setLoading(true)

    await fetch(`${API_URL}/order/confirm`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "x-api-key":API_KEY
      },
      body:JSON.stringify({droneId:DRONE_ID})
    })

    setLoading(false)
    setConfirmed(true)
    alert("Order Confirmed 🚀")
  }

  /* RESET (for testing) */
  const resetOrder=async()=>{
    await fetch(`${API_URL}/order/reset`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "x-api-key":API_KEY
      },
      body:JSON.stringify({droneId:DRONE_ID})
    })

    setBooked(false)
    setConfirmed(false)
  }

  return(
    <div className="bg-white p-6 rounded-t-3xl shadow-xl">

      {loading && <p>⏳ Talking to server...</p>}

      {!booked && (
        <button
          onClick={bookDrone}
          className="w-full bg-black text-white p-3 rounded-xl"
        >
          🚁 Book Drone
        </button>
      )}

      {booked && !confirmed && (
        <button
          onClick={confirmOrder}
          className="w-full bg-green-600 text-white p-3 rounded-xl"
        >
          ✅ Confirm Order
        </button>
      )}

      <button
        onClick={resetOrder}
        className="w-full mt-4 bg-red-500 text-white p-2 rounded-xl"
      >
        Reset (Test)
      </button>

    </div>
  )
}

export default FloatingInfoCard
