import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { totalQuantity } = useCart()
  return (
    <div style={{
      position: 'sticky', top: 0, background: '#0ea5e9', color: 'white',
      padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 700 }}>MedPortal</Link>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link to="/checkout" style={{ color: 'white', textDecoration: 'none' }}>Cart ({totalQuantity})</Link>
      </div>
    </div>
  )
}
