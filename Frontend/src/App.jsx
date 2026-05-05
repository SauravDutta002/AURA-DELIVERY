import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import Order from './Pages/Order'
import Tracking from './Pages/Tracking'
import Shipments from './Pages/Shipments'
import OrderDetail from './Pages/OrderDetail'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Order />} />
      <Route path='/order' element={<Navigate to="/" replace />} />
      <Route path='/track' element={<Tracking />} />
      <Route path='/shipments' element={<Shipments />} />
      <Route path='/order/:id' element={<OrderDetail />} />
    </Routes>
  )
}

export default App
