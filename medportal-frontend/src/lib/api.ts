import axios from 'axios'
import type { Medicine, Order } from '../types'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
export const api = axios.create({ baseURL: baseURL.replace(/\/$/, '') + '/api' })

export async function searchMedicines(query: string): Promise<Medicine[]> {
  const res = await api.get('/medicines/', { params: query ? { q: query } : {} })
  return res.data
}

export async function listMedicines(): Promise<Medicine[]> {
  const res = await api.get('/medicines/')
  return res.data
}

export async function checkout(payload: {
  customer_name: string
  customer_phone?: string
  customer_upi?: string
  items: { medicine_id: number; quantity: number }[]
}): Promise<Order> {
  const res = await api.post('/orders/checkout/', payload)
  return res.data
}

export async function getOrder(orderId: number): Promise<Order> {
  const res = await api.get(`/orders/${orderId}/`)
  return res.data
}

export function getUpiQrUrl(orderId: number, upiId?: string) {
  const url = new URL(api.defaults.baseURL + `/orders/${orderId}/upi_qr/`)
  if (upiId) url.searchParams.set('upi_id', upiId)
  return url.toString()
}

export async function confirmPayment(orderId: number, payment_reference: string): Promise<Order> {
  const res = await api.post(`/orders/${orderId}/confirm_payment/`, { payment_reference })
  return res.data
}
