import React, { createContext, useContext, useState, useCallback } from "react"

const OrderContext = createContext()

export const useOrder = () => {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider")
  return ctx
}

export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura_cart")) || [] } catch { return [] }
  })
  const [orderPlaced, setOrderPlaced] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura_orderPlaced")) || false } catch { return false }
  })
  const [orderItems, setOrderItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura_orderItems")) || [] } catch { return [] }
  })
  const [orderHistory, setOrderHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura_orderHistory")) || [] } catch { return [] }
  })
  const [currentOrderId, setCurrentOrderId] = useState(() => localStorage.getItem("aura_currentOrderId") || null)

  React.useEffect(() => { localStorage.setItem("aura_cart", JSON.stringify(cart)) }, [cart])
  React.useEffect(() => { localStorage.setItem("aura_orderPlaced", JSON.stringify(orderPlaced)) }, [orderPlaced])
  React.useEffect(() => { localStorage.setItem("aura_orderItems", JSON.stringify(orderItems)) }, [orderItems])
  React.useEffect(() => { localStorage.setItem("aura_orderHistory", JSON.stringify(orderHistory)) }, [orderHistory])
  React.useEffect(() => { 
    if (currentOrderId) localStorage.setItem("aura_currentOrderId", currentOrderId)
    else localStorage.removeItem("aura_currentOrderId")
  }, [currentOrderId])

  /* ── Cart Actions ───────────────────────────────── */
  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id)
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => {
      const item = prev.find((p) => p.id === productId)
      if (!item) return prev
      if (item.qty <= 1) return prev.filter((p) => p.id !== productId)
      return prev.map((p) =>
        p.id === productId ? { ...p, qty: p.qty - 1 } : p
      )
    })
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const getQty = useCallback(
    (productId) => cart.find((p) => p.id === productId)?.qty || 0,
    [cart]
  )

  /* ── Totals ─────────────────────────────────────── */
  const totalItems = cart.reduce((s, p) => s + p.qty, 0)
  const totalPrice = cart.reduce((s, p) => s + p.price * p.qty, 0)

  /* ── Place Order (snapshot cart → history) ──────── */
  const placeOrder = useCallback(() => {
    const orderId = `AURA-${Date.now().toString().slice(-6)}`
    const now = new Date()
    const newOrder = {
      id: orderId,
      items: [...cart],
      totalPrice: cart.reduce((s, p) => s + p.price * p.qty, 0),
      totalItems: cart.reduce((s, p) => s + p.qty, 0),
      status: "in_transit",
      createdAt: now.toISOString(),
      date: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    }
    setOrderItems([...cart])
    setCurrentOrderId(orderId)
    setOrderPlaced(true)
    setOrderHistory((prev) => [newOrder, ...prev])
    setCart([])
  }, [cart])

  const resetOrder = useCallback(() => {
    // Mark current order as delivered in history
    if (currentOrderId) {
      setOrderHistory((prev) =>
        prev.map((o) => o.id === currentOrderId ? { ...o, status: "delivered" } : o)
      )
    }
    setOrderPlaced(false)
    setOrderItems([])
    setCurrentOrderId(null)
  }, [currentOrderId])

  const getOrderById = useCallback(
    (id) => orderHistory.find((o) => o.id === id),
    [orderHistory]
  )

  return (
    <OrderContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getQty,
        totalItems,
        totalPrice,
        orderPlaced,
        orderItems,
        orderHistory,
        currentOrderId,
        placeOrder,
        resetOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}
