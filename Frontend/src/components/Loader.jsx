import React from "react"

const Loader = () => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
      bg-white rounded-t-3xl shadow-lg
      p-6 flex flex-col items-center gap-4">

      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-gray-300 
        border-t-black rounded-full animate-spin" />

      <p className="text-gray-700 font-medium">
        Connecting to drone...
      </p>
    </div>
  )
}

export default Loader
