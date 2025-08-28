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

  if (!order) return <div className="max-w-3xl mx-auto p-4">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div ref={ref}>
        <h2 className="text-xl font-semibold">Receipt</h2>
        <p>Order #{order.id} — {new Date(order.created_at).toLocaleString()}</p>
        <p>Customer: {order.customer_name}</p>
        <table className="w-full border-collapse mt-3">
          <thead>
            <tr>
              <th className="text-left border-b border-gray-200">Item</th>
              <th className="text-right border-b border-gray-200">Qty</th>
              <th className="text-right border-b border-gray-200">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(it => (
              <tr key={it.id}>
                <td className="py-1.5">{it.medicine.name}</td>
                <td className="text-right">{it.quantity}</td>
                <td className="text-right">₹{Number(it.price_each).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="border-t border-gray-200"></td>
              <td className="text-right border-t border-gray-200">Total</td>
              <td className="text-right border-t border-gray-200">₹{Number(order.total_amount).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-4">
        <button onClick={onPrint} className="px-4 py-2 bg-sky-500 text-white rounded-lg">Print</button>
      </div>
    </div>
  )
}
