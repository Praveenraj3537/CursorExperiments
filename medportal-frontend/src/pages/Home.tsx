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
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex gap-2 items-center mb-4">
        <input
          placeholder="Search medicines by name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 p-3 rounded-lg border border-gray-200"
        />
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(m => <MedicineCard key={m.id} medicine={m} />)}
        </div>
      )}
    </div>
  )
}
