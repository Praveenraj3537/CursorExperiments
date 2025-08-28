import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { totalQuantity } = useCart()
  return (
    <div className="sticky top-0 bg-sky-500 text-white px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-bold">MedPortal</Link>
      <Link to="/checkout" className="">Cart ({totalQuantity})</Link>
    </div>
  )
}
