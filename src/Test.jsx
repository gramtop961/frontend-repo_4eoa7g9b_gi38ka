import { useEffect, useState } from 'react'

export default function Test() {
  const [backend, setBackend] = useState('loading...')
  const [db, setDb] = useState('')

  useEffect(() => {
    fetch((import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000') + '/test')
      .then(r => r.json())
      .then(d => { setBackend(d.backend); setDb(d.database) })
      .catch(() => setBackend('error'))
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded-xl shadow">
        <div className="font-semibold">Backend: {backend}</div>
        <div>Database: {db}</div>
      </div>
    </div>
  )
}
