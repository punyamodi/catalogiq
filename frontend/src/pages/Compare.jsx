import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import CompareView from '../components/compare/CompareView'
import { listAnalyses, compareAnalyses } from '../services/api'

export default function Compare() {
  const [searchParams] = useSearchParams()
  const [analyses, setAnalyses] = useState([])
  const [id1, setId1] = useState(searchParams.get('a') || '')
  const [id2, setId2] = useState(searchParams.get('b') || '')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    listAnalyses(0, 100).then(setAnalyses)
  }, [])

  useEffect(() => {
    if (id1 && id2) runCompare()
  }, [])

  const runCompare = async () => {
    if (!id1 || !id2 || id1 === id2) {
      setError('Select two different analyses to compare.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await compareAnalyses(Number(id1), Number(id2))
      setResult(data)
    } catch {
      setError('Comparison failed. Ensure both analyses exist.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compare Catalogs</h1>
        <p className="text-slate-400 mt-1">Select two analyses to compare them side by side.</p>
      </div>

      <div className="card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Catalog A', value: id1, setter: setId1 },
          { label: 'Catalog B', value: id2, setter: setId2 },
        ].map(({ label, value, setter }) => (
          <div key={label} className="space-y-1.5">
            <label className="text-sm text-slate-400">{label}</label>
            <select
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="input"
            >
              <option value="">— Select a catalog —</option>
              {analyses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.filename} ({Math.round(a.overall_score)})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-950/30 border border-red-900/50 rounded-xl p-4 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={runCompare}
        disabled={!id1 || !id2 || loading}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Comparing…</> : 'Run Comparison'}
      </button>

      {result && <CompareView result={result} />}
    </div>
  )
}
