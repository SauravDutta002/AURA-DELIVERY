import React, { useEffect, useRef, useState } from "react"
import { FaLocationCrosshairs } from "react-icons/fa6"
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md"
import { HiHome } from "react-icons/hi2"
import { PiWarehouseFill, PiFlyingSaucerFill } from "react-icons/pi"
import Loader from "./Loader"

const FloatingInfoCard = ({ onLocation }) => {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(true)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!loading) return
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 1))
    }, 28)
    return () => clearInterval(interval)
  }, [loading])

  const getLiveLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported")
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false)
        const { latitude, longitude } = pos.coords
        onLocation && onLocation([latitude, longitude])
      },
      () => {
        setLoading(false)
        alert("Location access denied")
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl
      bg-white rounded-t-[2.5rem] shadow-[0_-14px_50px_rgba(0,0,0,0.12)]
      z-30 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] overflow-hidden
      ${open ? "max-h-[75vh]" : "h-24"}`}
      style={open ? { height: contentRef.current?.scrollHeight } : {}}
    >
      {/* Handle */}
      {/* <Loader/> */}
      
      <div
        onClick={() => setOpen(!open)}
        className="w-full flex flex-col items-center pt-2 cursor-pointer"
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mb-1" />
        {open ? (
          <MdKeyboardArrowDown size={22} className="text-gray-400" />
        ) : (
          <MdKeyboardArrowUp size={22} className="text-gray-400" />
        )}
      </div>

      {/* Content */}
      <div ref={contentRef} className="px-6 pb-10 flex flex-col gap-8">
        {/* Progress */}
        <div>
          <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
            <PiWarehouseFill className="text-2xl text-yellow-400" />
            <span>{progress}%</span>
            <HiHome className="text-xl text-blue-500" />
          </div>

          <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-visible">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />

            {/* UFO */}
            <div
              className="absolute -top-2 transition-all duration-300"
              style={{ left: `calc(${progress}% - 16px)` }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 bg-indigo-500 blur-lg opacity-30 rounded-full" />
                <PiFlyingSaucerFill
                  className="relative text-xl drop-shadow-[0_4px_10px_rgba(99,102,241,0.5)]
                  animate-[float_3s_ease-in-out_infinite]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <button
          onClick={getLiveLocation}
          className="w-full flex items-center justify-center gap-2 px-4 py-3
          bg-black text-white rounded-xl shadow-md
          hover:scale-[1.02] active:scale-[0.98] transition"
        >
          <FaLocationCrosshairs />
          Use Live Location
        </button>

        {/* Slide */}
        <SlideToConfirm onConfirm={() => alert("Order Confirmed 🚀")} />
      </div>
    </div>
  )
}

const SlideToConfirm = ({ onConfirm }) => {
  const [dragX, setDragX] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const sliderRef = useRef(null)
  const maxDrag = 240

  const handleMove = (e) => {
    if (confirmed) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const rect = sliderRef.current.getBoundingClientRect()
    let newX = clientX - rect.left - 24
    newX = Math.max(0, Math.min(newX, maxDrag))
    setDragX(newX)
  }

  const handleEnd = () => {
    if (confirmed) return
    if (dragX > maxDrag * 0.92) {
      setDragX(maxDrag)
      setConfirmed(true)
      onConfirm && onConfirm()
    } else setDragX(0)
  }

  return (
    <div
      ref={sliderRef}
      className={`relative h-14 w-full rounded-xl flex items-center px-2 shadow-inner select-none transition-all
      ${confirmed ? "bg-green-500/20" : "bg-gray-100"}`}
      onMouseMove={(e) => dragX !== 0 && handleMove(e)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div
        onMouseDown={() => setDragX(1)}
        onTouchStart={() => setDragX(1)}
        style={{ transform: `translateX(${dragX}px)` }}
        className={`absolute left-1 top-1 w-12 h-12 rounded-xl flex items-center justify-center
        shadow-lg transition-all duration-300 ease-out
        ${confirmed ? "bg-green-500 scale-110" : "bg-black hover:scale-105"} text-white`}
      >
        {confirmed ? "✓" : "→"}
      </div>

      <p className={`absolute left-1/2 -translate-x-1/2 text-sm font-medium transition
        ${confirmed ? "text-green-600" : "text-gray-500"}`}
      >
        {confirmed ? "Order Confirmed" : "Slide to confirm"}
      </p>
    </div>
  )
}

export default FloatingInfoCard