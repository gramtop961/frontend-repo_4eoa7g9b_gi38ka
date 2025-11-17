import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { api } from './lib/api'
import CreateVehicleForm from './components/CreateVehicleForm'

function StatusPill({ label, active, onClick }) {
  const colors = {
    imported: 'bg-blue-100 text-blue-700',
    active: 'bg-emerald-100 text-emerald-700',
    dismantled: 'bg-amber-100 text-amber-700',
    scrapped: 'bg-rose-100 text-rose-700',
    all: 'bg-gray-100 text-gray-700',
  }
  const cls = active ? 'ring-2 ring-black/5' : 'opacity-80'
  return (
    <button onClick={onClick} className={`px-3 py-1 rounded-full text-sm ${colors[label] || colors.all} ${cls}`}>
      {label}
    </button>
  )
}

function VehicleCard({ v }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
        {v.vin?.slice(0, 8) || 'No VIN'}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{v.make || 'Unknown'} {v.model || ''} {v.year || ''}</div>
        <div className="text-xs text-gray-500">Engine: {v.engine_condition || 'unknown'} • Body: {v.body_condition || 'unknown'} • Damage: {v.damage_level || 'unknown'}</div>
      </div>
      <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 capitalize">{v.status || 'unknown'}</div>
    </div>
  )
}

function Dashboard() {
  const [status, setStatus] = useState('all')
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const filtered = useMemo(() => vehicles, [vehicles])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await api.listVehicles(status === 'all' ? undefined : status)
        if (mounted) setVehicles(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [status])

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Vehicles</h2>
        <div className="flex items-center gap-3">
          <CreateVehicleForm onCreated={(v)=> setVehicles(prev=>[v, ...prev])} />
          <div className="flex gap-2">
            {['all','imported','active','dismantled','scrapped'].map(s => (
              <StatusPill key={s} label={s} active={status===s} onClick={() => setStatus(s)} />
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(v => <VehicleCard key={v.id} v={v} />)}
          {filtered.length === 0 && (
            <div className="text-gray-500">No vehicles yet.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="relative h-[320px] w-full overflow-hidden">
        <Spline scene="https://prod.spline.design/4Tf9WOIaWs6LOezG/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-6 mx-auto max-w-5xl px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 drop-shadow-sm">BMW ELV Tracking</h1>
          <p className="mt-2 text-gray-700 max-w-2xl">Log imports, conditions, dismantling, parts, and recycling routes — designed for imperfect data and offline-first workflows.</p>
        </div>
      </header>

      <main className="flex-1">
        <Dashboard />
      </main>

      <footer className="border-t bg-gray-50 py-6 text-center text-sm text-gray-500">Offline-ready • Zod-validated • Modular</footer>
    </div>
  )}
