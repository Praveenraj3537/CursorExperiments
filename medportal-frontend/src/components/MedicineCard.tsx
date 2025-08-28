import { useState } from 'react'
import type { Medicine } from '../types'
import { useCart } from '../context/CartContext'

export default function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { add, totalQuantity } = useCart()
  const [qty, setQty] = useState(1)
  const maxAddable = Math.max(0, Math.min(medicine.stock, 10 - totalQuantity))

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>{medicine.name}</h3>
        <span style={{ fontWeight: 700 }}>₹{Number(medicine.price).toFixed(2)}</span>
      </div>
      <p style={{ color: '#4b5563', marginTop: 8 }}>{medicine.content || 'No description'}</p>
      <p style={{ marginTop: 8 }}>
        {medicine.stock > 0 ? (
          <span style={{ color: '#059669' }}>In stock: {medicine.stock}</span>
        ) : (
          <span style={{ color: '#dc2626' }}>Out of stock — available in up to 2 working days</span>
        )}
      </p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
        <input type="number" min={1} max={maxAddable || 1} value={qty}
               onChange={e => setQty(Math.max(1, Math.min(Number(e.target.value || 1), maxAddable || 1)))}
               style={{ width: 80, padding: 6 }} />
        <button disabled={medicine.stock === 0 || maxAddable === 0}
                onClick={() => add(medicine, qty)}
                style={{ padding: '8px 12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 8 }}>
          Add to cart
        </button>
      </div>
    </div>
  )
}
