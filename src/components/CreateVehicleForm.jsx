import { useState } from 'react'
import { api } from '../lib/api'

export default function CreateVehicleForm({ onCreated }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ vin: '', make: '', model: '', year: '', status: 'imported' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        vin: form.vin || undefined,
        make: form.make || undefined,
        model: form.model || undefined,
        year: form.year ? parseInt(form.year, 10) : undefined,
        status: form.status || undefined,
      }
      const v = await api.createVehicle(payload)
      onCreated?.(v)
      setOpen(false)
      setForm({ vin: '', make: '', model: '', year: '', status: 'imported' })
    } catch (e) {
      setError(e.message || 'Failed to create vehicle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold">Add Vehicle</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">New Vehicle</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>
            {error && <div className="text-sm text-rose-600">{error}</div>}
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">VIN (optional)</label>
                  <input name="vin" value={form.vin} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="WBA..." />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Year (optional)</label>
                  <input name="year" value={form.year} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="2010" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Make</label>
                  <input name="make" value={form.make} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="BMW" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Model</label>
                  <input name="model" value={form.model} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="330i" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Status</label>
                <select name="status" value={form.status} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="imported">imported</option>
                  <option value="active">active</option>
                  <option value="dismantled">dismantled</option>
                  <option value="scrapped">scrapped</option>
                  <option value="unknown">unknown</option>
                </select>
              </div>
              <div className="pt-2 flex items-center gap-2 justify-end">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg border text-sm">Cancel</button>
                <button disabled={loading} className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold">
                  {loading ? 'Saving…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
