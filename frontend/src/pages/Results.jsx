import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2, AlertCircle, Download, ArrowLeft, FileText } from 'lucide-react'
import ScoreCard from '../components/analysis/ScoreCard'
import { RadarScoreChart, BarScoreChart } from '../components/analysis/ScoreChart'
import AnalysisDetails from '../components/analysis/AnalysisDetails'
import IssuesList from '../components/analysis/IssuesList'
import { getAnalysis, getReportUrl } from '../services/api'
import { formatDate, formatFileSize } from '../utils/helpers'

export default function Results() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAnalysis(id)
      .then(setData)
      .catch(() => setError('Analysis not found or failed to load.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )

  if (error)
    return (
      <div className="flex items-center gap-3 bg-red-950/30 border border-red-900/50 rounded-xl p-4 text-red-400 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        {error}
      </div>
    )

  const { scores, filename, file_size, page_count, word_count, summary, strengths, weaknesses, recommendations, issues, llm_provider, llm_model, created_at } = data
  const dimScores = [
    { score: scores.content_score, label: 'Content Quality' },
    { score: scores.readability_score, label: 'Readability' },
    { score: scores.structure_score, label: 'Structure' },
    { score: scores.product_info_score, label: 'Product Info' },
    { score: scores.formatting_score, label: 'Formatting' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link to="/history" className="text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3 h-3" /> Back to History
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            {filename}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {formatDate(created_at)} &middot; {formatFileSize(file_size)} &middot; {page_count ?? '?'} pages &middot;{' '}
            {word_count ? word_count.toLocaleString() + ' words' : '?'} &middot; via {llm_provider}
          </p>
        </div>
        <a
          href={getReportUrl(id)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Download Report
        </a>
      </div>

      {summary && (
        <div className="card p-4">
          <p className="text-slate-300 leading-relaxed">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <ScoreCard score={scores.overall_score} label="Overall Score" size="lg" />
        </div>
        <div className="lg:col-span-2 card p-4">
          <h3 className="font-semibold text-slate-300 mb-3 text-sm uppercase tracking-wider">Score Breakdown</h3>
          <RadarScoreChart scores={scores} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {dimScores.map(({ score, label }) => (
          <ScoreCard key={label} score={score} label={label} />
        ))}
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-slate-300 mb-3 text-sm uppercase tracking-wider">Bar Chart</h3>
        <BarScoreChart scores={scores} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Strengths, Weaknesses & Recommendations</h2>
        <AnalysisDetails strengths={strengths} weaknesses={weaknesses} recommendations={recommendations} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Issues Found ({issues.length})</h2>
        <IssuesList issues={issues} />
      </div>
    </div>
  )
}
