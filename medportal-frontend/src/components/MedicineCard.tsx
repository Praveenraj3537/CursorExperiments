import { useState } from 'react'
import type { Medicine } from '../types'
import { useCart } from '../context/CartContext'

export default function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { add, totalQuantity } = useCart()
  const [qty, setQty] = useState(1)
  const maxAddable = Math.max(0, Math.min(medicine.stock, 10 - totalQuantity))

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-start justify-between gap-2">
        <h3 className="m-0 font-semibold text-sm sm:text-base">{medicine.name}</h3>
        <span className="font-bold">₹{Number(medicine.price).toFixed(2)}</span>
      </div>
      <p className="text-gray-600 mt-2 text-sm leading-snug">{medicine.content || 'No description'}</p>
      <p className="mt-2 text-sm">
        {medicine.stock > 0 ? (
          <span className="text-emerald-600">In stock: {medicine.stock}</span>
        ) : (
          <span className="text-red-600">Out of stock — available in up to 2 working days</span>
        )}
      </p>
      <div className="flex gap-2 items-center mt-2">
        <input type="number" min={1} max={maxAddable || 1} value={qty}
               onChange={e => setQty(Math.max(1, Math.min(Number(e.target.value || 1), maxAddable || 1)))}
               className="w-24 p-2 border border-gray-300 rounded-md" />
        <button disabled={medicine.stock === 0 || maxAddable === 0}
                onClick={() => add(medicine, qty)}
                className="px-3 py-2 bg-sky-500 disabled:opacity-50 text-white rounded-lg text-sm">
          Add to cart
        </button>
      </div>
    </div>
  )
}
