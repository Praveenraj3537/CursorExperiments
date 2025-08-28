import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import Receipt from './pages/Receipt'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pay/:id" element={<Payment />} />
          <Route path="/receipt/:id" element={<Receipt />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
