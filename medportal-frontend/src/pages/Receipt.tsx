import { useEffect, useRef, useState } from 'react'
import { getOrder } from '../lib/api'
import type { Order } from '../types'
import { useParams } from 'react-router-dom'

export default function Receipt() {
  const { id } = useParams()
  const orderId = Number(id)
  const [order, setOrder] = useState<Order | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getOrder(orderId).then(setOrder)
  }, [orderId])

  function onPrint() {
    window.print()
  }

  if (!order) return <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>Loading...</div>

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <div ref={ref}>
        <h2>Receipt</h2>
        <p>Order #{order.id} — {new Date(order.created_at).toLocaleString()}</p>
        <p>Customer: {order.customer_name}</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Item</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Qty</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(it => (
              <tr key={it.id}>
                <td style={{ padding: '6px 0' }}>{it.medicine.name}</td>
                <td style={{ textAlign: 'right' }}>{it.quantity}</td>
                <td style={{ textAlign: 'right' }}>₹{Number(it.price_each).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ borderTop: '1px solid #e5e7eb' }}></td>
              <td style={{ textAlign: 'right', borderTop: '1px solid #e5e7eb' }}>Total</td>
              <td style={{ textAlign: 'right', borderTop: '1px solid #e5e7eb' }}>₹{Number(order.total_amount).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={onPrint} style={{ padding: '10px 14px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 8 }}>Print</button>
      </div>
    </div>
  )
}
