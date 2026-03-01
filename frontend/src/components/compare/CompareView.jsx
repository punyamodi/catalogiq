import { clsx } from 'clsx'
import { scoreColor, scoreGrade } from '../../utils/helpers'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const SCORE_LABELS = {
  overall_score: 'Overall',
  content_score: 'Content Quality',
  readability_score: 'Readability',
  structure_score: 'Structure',
  product_info_score: 'Product Info',
  formatting_score: 'Formatting',
}

function DiffBadge({ diff }) {
  if (Math.abs(diff) < 0.5) return <Minus className="w-4 h-4 text-slate-500" />
  if (diff > 0)
    return (
      <span className="flex items-center gap-0.5 text-green-400 text-xs font-semibold">
        <TrendingUp className="w-3 h-3" /> +{diff.toFixed(1)}
      </span>
    )
  return (
    <span className="flex items-center gap-0.5 text-red-400 text-xs font-semibold">
      <TrendingDown className="w-3 h-3" /> {diff.toFixed(1)}
    </span>
  )
}

export default function CompareView({ result }) {
  const { analysis_1: a1, analysis_2: a2, comparison } = result

  const rows = Object.entries(SCORE_LABELS).map(([key, label]) => {
    const s1 = a1.scores[key] ?? 0
    const s2 = a2.scores[key] ?? 0
    const diffKey = key.replace('_score', '_diff')
    const diff = comparison[diffKey] ?? 0
    return { key, label, s1, s2, diff }
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[a1, a2].map((a, idx) => (
          <div key={idx} className="card p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">Catalog {idx + 1}</p>
            <p className="font-semibold text-slate-100 truncate">{a.filename}</p>
            <p className={clsx('text-3xl font-bold mt-2', scoreColor(a.scores.overall_score))}>
              {Math.round(a.scores.overall_score)}
            </p>
            <p className="text-slate-400 text-sm">{scoreGrade(a.scores.overall_score)}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="py-3 px-4 text-left text-slate-400 font-medium">Dimension</th>
              <th className="py-3 px-4 text-center text-slate-400 font-medium">{a1.filename}</th>
              <th className="py-3 px-4 text-center text-slate-400 font-medium">Change</th>
              <th className="py-3 px-4 text-center text-slate-400 font-medium">{a2.filename}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ key, label, s1, s2, diff }) => (
              <tr key={key} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                <td className="py-3 px-4 text-slate-300 font-medium">{label}</td>
                <td className={clsx('py-3 px-4 text-center font-semibold', scoreColor(s1))}>
                  {Math.round(s1)}
                </td>
                <td className="py-3 px-4 text-center">
                  <DiffBadge diff={diff} />
                </td>
                <td className={clsx('py-3 px-4 text-center font-semibold', scoreColor(s2))}>
                  {Math.round(s2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-4 text-center">
        <p className="text-slate-400 text-sm">Winner</p>
        <p className="text-indigo-400 font-semibold text-lg mt-1">{comparison.winner}</p>
      </div>
    </div>
  )
}
