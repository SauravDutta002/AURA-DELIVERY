import React, { useRef, useState } from "react"
import DroneIcon from "../assets/icons/Drone_Icon.png"

const Loader = () => {
  const [open, setOpen] = useState(true)
  const contentRef = useRef(null)

  return (
    <div
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl
       rounded-t-[2.5rem]
      shadow-[0_-14px_50px_rgba(0,0,0,0.12)]
      z-30 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
      overflow-hidden ${open ? "max-h-[75vh]" : "h-24"}`}
    >
      {/* Drag Handle */}
       <div className="w-full mt-4">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-black rounded-full animate-progress" />
            </div>
          </div>
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-center py-3 cursor-pointer"
      >
        
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className={`transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-4 p-6">
          <img
            src={DroneIcon}
            alt="Drone"
            className="w-30 animate-float"
          />

          <h2 className="text-xl font-semibold text-gray-800">
            Drone in Transit
          </h2>

          

          {/* Progress Bar */}
         
        </div>
      </div>
    </div>
  )
}

export default Loader