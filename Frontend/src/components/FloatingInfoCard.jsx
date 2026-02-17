import React, { useState, useRef } from "react"
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md"
import { HiHome } from "react-icons/hi2"
import { PiWarehouseFill, PiFlyingSaucerFill } from "react-icons/pi"
import Loader from "./Loader"

const API_URL = "https://aura-delivery-1.onrender.com"
const DRONE_ID = "DRONE001"

const FloatingInfoCard = ({ onBooked, onConfirmed }) => {
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(true)

  const [booking, setBooking] = useState(false)
  const [booked, setBooked] = useState(false)

  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const contentRef = useRef(null)

  /* ================= BOOK DRONE ================= */
  const bookDrone = async () => {
    setBooking(true)

    await fetch(`${API_URL}/drone/book/${DRONE_ID}`, {
      method: "POST"
    })

    setTimeout(() => {
      setBooking(false)
      setBooked(true)
      onBooked && onBooked()
    }, 2000)
  }

  /* ================= CONFIRM ================= */
  const confirmOrder = async () => {
    setConfirming(true)

    await fetch(`${API_URL}/drone/confirm/${DRONE_ID}`, {
      method: "POST"
    })

    setTimeout(() => {
      setConfirming(false)
      setConfirmed(true)
      onConfirmed && onConfirmed()

      // progress animation
      let p = 0
      const int = setInterval(()=>{
        p+=5
        setProgress(p)
        if(p>=100) clearInterval(int)
      },150)

    },1500)
  }

  return (
    <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl
      bg-white rounded-t-[2.5rem] shadow-xl z-50 overflow-hidden`}>

      {/* Handle */}
      <div onClick={()=>setOpen(!open)}
        className="w-full flex flex-col items-center pt-2 cursor-pointer">
        <div className="w-12 h-1 bg-gray-300 rounded-full mb-1"/>
        {open ? <MdKeyboardArrowDown/> : <MdKeyboardArrowUp/>}
      </div>

      <div ref={contentRef} className="px-6 pb-10 flex flex-col gap-8">

        {/* PROGRESS */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <PiWarehouseFill className="text-yellow-400 text-2xl"/>
            <span>{progress}%</span>
            <HiHome className="text-blue-500 text-xl"/>
          </div>

          <div className="relative h-2 bg-gray-100 rounded-full">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              style={{width:`${progress}%`}}/>

            <PiFlyingSaucerFill
              className="absolute -top-2 text-indigo-500"
              style={{left:`calc(${progress}% - 10px)`}}
            />
          </div>
        </div>

        {/* BOOK BUTTON */}
        {!booked && (
          <button onClick={bookDrone}
            className="bg-black text-white py-3 rounded-xl">
            Book Drone
          </button>
        )}

        {/* LOADER */}
        {booking && <Loader/>}

        {/* CONFIRM SLIDER */}
        {booked && !confirmed && (
          <SlideToConfirm onConfirm={confirmOrder}/>
        )}

        {confirming && <Loader/>}

        {confirmed && (
          <p className="text-center text-green-600 font-semibold">
            ✅ Order Confirmed
          </p>
        )}

      </div>
    </div>
  )
}

/* ================= SLIDER ================= */

const SlideToConfirm = ({ onConfirm }) => {
  const [dragX,setDragX]=useState(0)
  const sliderRef = useRef(null)
  const maxDrag = 240

  const move=e=>{
    const x=e.touches?e.touches[0].clientX:e.clientX
    const rect=sliderRef.current.getBoundingClientRect()
    let nx=x-rect.left-24
    nx=Math.max(0,Math.min(nx,maxDrag))
    setDragX(nx)
  }

  const end=()=>{
    if(dragX>maxDrag*0.9) onConfirm()
    setDragX(0)
  }

  return (
    <div ref={sliderRef}
      className="relative h-14 bg-gray-100 rounded-xl"
      onMouseMove={e=>dragX&&move(e)}
      onMouseUp={end}
      onTouchMove={move}
      onTouchEnd={end}>

      <div onMouseDown={()=>setDragX(1)}
        onTouchStart={()=>setDragX(1)}
        style={{transform:`translateX(${dragX}px)`}}
        className="absolute w-12 h-12 bg-black text-white
          flex items-center justify-center rounded-xl">
        →
      </div>

      <p className="text-center pt-4 text-gray-500">
        Slide to confirm
      </p>
    </div>
  )
}

export default FloatingInfoCard
