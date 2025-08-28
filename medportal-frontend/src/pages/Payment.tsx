import { useEffect, useMemo, useState } from 'react'
import { confirmPayment, getOrder, getUpiQrUrl } from '../lib/api'
import type { Order } from '../types'
import { useNavigate, useParams } from 'react-router-dom'

export default function Payment() {
  const { id } = useParams()
  const orderId = Number(id)
  const [order, setOrder] = useState<Order | null>(null)
  const [upiId, setUpiId] = useState('')
  const [ref, setRef] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    getOrder(orderId).then(setOrder)
  }, [orderId])

  const qrUrl = useMemo(() => order ? getUpiQrUrl(order.id, upiId || order.customer_upi) : '', [order, upiId])

  async function onConfirm() {
    if (!ref.trim()) return
    setLoading(true)
    try {
      const updated = await confirmPayment(orderId, ref)
      setOrder(updated)
      nav(`/receipt/${updated.id}`)
    } finally {
      setLoading(false)
    }
  }

  if (!order) return <div className="max-w-3xl mx-auto p-4">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold">Pay via UPI</h2>
      <p className="mt-1">Order #{order.id} • Amount: ₹{Number(order.total_amount).toFixed(2)}</p>

      <div className="flex flex-col sm:flex-row gap-6 items-start mt-4">
        <div>
          {qrUrl ? (
            <img src={qrUrl} alt="UPI QR" className="w-60 h-60 border border-gray-200" />
          ) : (
            <div className="w-60 h-60 grid place-items-center border border-gray-200">QR</div>
          )}
          <div className="mt-2">
            <input placeholder="Your UPI ID (optional)" value={upiId} onChange={e => setUpiId(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        <div className="flex-1 w-full">
          <p>After paying, enter the payment reference to confirm.</p>
          <input placeholder="Payment reference" value={ref} onChange={e => setRef(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
          <div className="mt-3">
            <button disabled={!ref.trim() || loading} onClick={onConfirm} className="px-4 py-3 bg-emerald-600 disabled:opacity-50 text-white rounded-lg">
              {loading ? 'Confirming...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
