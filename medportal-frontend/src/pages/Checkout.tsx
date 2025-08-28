import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { checkout } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const { lines, totalPrice, totalQuantity, remove, update, clear } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [upi, setUpi] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const canSubmit = totalQuantity > 0 && totalQuantity <= 10 && name.trim().length > 0

  async function onCheckout() {
    setError('')
    setLoading(true)
    try {
      const order = await checkout({
        customer_name: name,
        customer_phone: phone,
        customer_upi: upi,
        items: lines.map(l => ({ medicine_id: l.medicine.id, quantity: l.quantity }))
      })
      clear()
      nav(`/pay/${order.id}`)
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-semibold">Checkout</h2>
      {lines.length === 0 ? <p className="mt-2">Your cart is empty.</p> : (
        <>
          <div className="grid gap-3">
            {lines.map(l => (
              <div key={l.medicine.id} className="flex items-center gap-3 border border-gray-200 p-3 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm sm:text-base truncate">{l.medicine.name}</div>
                  <div className="text-gray-600">₹{Number(l.medicine.price).toFixed(2)}</div>
                </div>
                <input type="number" min={1} max={Math.min(l.medicine.stock, 10)} value={l.quantity}
                       onChange={e => update(l.medicine.id, Math.min(Number(e.target.value || 1), 10))}
                       className="w-24 p-2 border border-gray-300 rounded-md" />
                <button onClick={() => remove(l.medicine.id)} className="px-3 py-2 border rounded-md">Remove</button>
              </div>
            ))}
          </div>

          <div className="mt-4 font-bold">Total: ₹{totalPrice.toFixed(2)} ({totalQuantity} items)</div>

          <div className="grid gap-2 mt-4">
            <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="p-2 rounded-lg border border-gray-200" />
            <input placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} className="p-2 rounded-lg border border-gray-200" />
            <input placeholder="Your UPI ID (optional)" value={upi} onChange={e => setUpi(e.target.value)} className="p-2 rounded-lg border border-gray-200" />
          </div>

          {error && <p className="text-red-600 mt-2">{error}</p>}
          <div className="mt-4">
            <button disabled={!canSubmit || loading} onClick={onCheckout} className="px-4 py-3 bg-emerald-600 disabled:opacity-50 text-white rounded-lg">
              {loading ? 'Placing order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
