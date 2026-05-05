import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { OrderProvider } from "./context/OrderContext"
import App from "./App.jsx"
import "./index.css"

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <OrderProvider>
      <App />
    </OrderProvider>
  </BrowserRouter>
)

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Service worker registration failed:", error)
    })
  })
}
