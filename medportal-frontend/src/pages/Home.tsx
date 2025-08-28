import { useEffect, useState } from 'react'
import { searchMedicines } from '../lib/api'
import type { Medicine } from '../types'
import MedicineCard from '../components/MedicineCard'

export default function Home() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Medicine[]>([])

  useEffect(() => {
    let active = true
    setLoading(true)
    searchMedicines(query).then(d => {
      if (active) setItems(d)
    }).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [query])

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <input
          placeholder="Search medicines by name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
      </div>

      {loading ? <p>Loading...</p> : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16
        }}>
          {items.map(m => <MedicineCard key={m.id} medicine={m} />)}
        </div>
      )}
    </div>
  )
}
