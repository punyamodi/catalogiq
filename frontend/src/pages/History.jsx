import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, GitCompare, RefreshCw } from 'lucide-react'
import HistoryTable from '../components/history/HistoryTable'
import { listAnalyses, deleteAnalysis } from '../services/api'

export default function History() {
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState([])

  const load = () => {
    setLoading(true)
    listAnalyses()
      .then(setAnalyses)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    await deleteAnalysis(id)
    setAnalyses((prev) => prev.filter((a) => a.id !== id))
    setSelectedIds((prev) => prev.filter((i) => i !== id))
  }

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    )
  }

  const handleCompare = () => {
    if (selectedIds.length === 2) {
      navigate(`/compare?a=${selectedIds[0]}&b=${selectedIds[1]}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Analysis History</h1>
          <p className="text-slate-400 mt-1">{analyses.length} catalog{analyses.length !== 1 ? 's' : ''} analyzed</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          {selectedIds.length === 2 && (
            <button onClick={handleCompare} className="btn-primary flex items-center gap-2">
              <GitCompare className="w-4 h-4" /> Compare Selected
            </button>
          )}
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="text-sm text-indigo-400 bg-indigo-950/30 border border-indigo-800/40 rounded-lg px-4 py-2">
          {selectedIds.length === 1
            ? 'Select one more to enable comparison.'
            : 'Two catalogs selected. Click Compare Selected to proceed.'}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <HistoryTable
          analyses={analyses}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
        />
      )}
    </div>
  )
}
