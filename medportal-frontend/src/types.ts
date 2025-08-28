export type Medicine = {
  id: number
  name: string
  content: string
  price: number
  stock: number
  is_active: boolean
}

export type CartLine = {
  medicine: Medicine
  quantity: number
}

export type OrderItem = {
  id: number
  medicine: Medicine
  quantity: number
  price_each: number
}

export type Order = {
  id: number
  created_at: string
  customer_name: string
  customer_phone: string
  customer_upi: string
  total_amount: number
  paid: boolean
  payment_reference: string
  items: OrderItem[]
}
