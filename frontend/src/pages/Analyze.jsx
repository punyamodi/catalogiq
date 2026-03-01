import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import UploadZone from '../components/upload/UploadZone'
import { analyzeFile } from '../services/api'

export default function Analyze() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const result = await analyzeFile(file)
      navigate(`/results/${result.id}`)
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (err.code === 'ECONNABORTED' ? 'Request timed out. The LLM may be slow.' : 'Analysis failed. Please try again.')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analyze Catalog</h1>
        <p className="text-slate-400 mt-1">Upload a PDF catalog and receive a detailed AI quality report.</p>
      </div>

      <UploadZone onFile={setFile} disabled={loading} />

      {error && (
        <div className="flex items-start gap-3 bg-red-950/30 border border-red-900/50 rounded-xl p-4 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing — this may take a minute…
          </>
        ) : (
          'Start Analysis'
        )}
      </button>

      {loading && (
        <p className="text-center text-slate-500 text-sm">
          The AI is reading and scoring your catalog. Large files may take up to 2 minutes.
        </p>
      )}
    </div>
  )
}
