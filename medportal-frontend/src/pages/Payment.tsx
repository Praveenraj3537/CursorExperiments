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

  if (!order) return <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>Loading...</div>

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h2>Pay via UPI</h2>
      <p>Order #{order.id} • Amount: ₹{Number(order.total_amount).toFixed(2)}</p>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginTop: 16 }}>
        <div>
          {qrUrl ? <img src={qrUrl} alt="UPI QR" style={{ width: 240, height: 240, border: '1px solid #e5e7eb' }} /> : <div style={{ width: 240, height: 240, display: 'grid', placeItems: 'center', border: '1px solid #e5e7eb' }}>QR</div>}
          <div style={{ marginTop: 8 }}>
            <input placeholder="Your UPI ID (optional)" value={upiId} onChange={e => setUpiId(e.target.value)} style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 6 }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p>After paying, enter the payment reference to confirm.</p>
          <input placeholder="Payment reference" value={ref} onChange={e => setRef(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }} />
          <div style={{ marginTop: 12 }}>
            <button disabled={!ref.trim() || loading} onClick={onConfirm} style={{ padding: '12px 16px', background: '#16a34a', color: 'white', borderRadius: 8, border: 'none' }}>
              {loading ? 'Confirming...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
