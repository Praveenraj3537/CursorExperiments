import React, { createContext, useContext, useMemo, useState } from 'react'
import type { CartLine, Medicine } from '../types'

type CartContextType = {
  lines: CartLine[]
  add: (medicine: Medicine, qty: number) => void
  remove: (medicineId: number) => void
  update: (medicineId: number, qty: number) => void
  clear: () => void
  totalQuantity: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const api = useMemo<CartContextType>(() => {
    return {
      lines,
      add: (medicine, qty) => {
        setLines(prev => {
          const existing = prev.find(l => l.medicine.id === medicine.id)
          const newQty = (existing?.quantity || 0) + qty
          const clampedQty = Math.max(0, Math.min(newQty, Math.min(medicine.stock, 10)))
          if (existing) {
            return prev.map(l => (l.medicine.id === medicine.id ? { ...l, quantity: clampedQty } : l))
          }
          return [...prev, { medicine, quantity: clampedQty }]
        })
      },
      update: (medicineId, qty) => {
        setLines(prev => prev.map(l => (l.medicine.id === medicineId ? { ...l, quantity: Math.max(0, qty) } : l)))
      },
      remove: (medicineId) => setLines(prev => prev.filter(l => l.medicine.id !== medicineId)),
      clear: () => setLines([]),
      totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
      totalPrice: lines.reduce((s, l) => s + l.quantity * Number(l.medicine.price), 0),
    }
  }, [lines])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
