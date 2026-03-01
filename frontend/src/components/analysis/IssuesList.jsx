import { clsx } from 'clsx'
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'

const severityConfig = {
  high: { label: 'High', className: 'badge-high', icon: AlertCircle },
  medium: { label: 'Medium', className: 'badge-medium', icon: AlertTriangle },
  low: { label: 'Low', className: 'badge-low', icon: Info },
}

export default function IssuesList({ issues }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="card p-6 text-center text-slate-500">
        No issues detected.
      </div>
    )
  }

  const sorted = [...issues].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3)
  })

  return (
    <div className="space-y-3">
      {sorted.map((issue, i) => {
        const { label, className, icon: Icon } = severityConfig[issue.severity] || severityConfig.low
        return (
          <div key={i} className="card p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="font-medium text-slate-200 text-sm">{issue.category}</span>
              </div>
              <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border', className)}>
                {label}
              </span>
            </div>
            <p className="text-sm text-slate-400">{issue.description}</p>
            {issue.suggestion && (
              <p className="text-sm text-indigo-400 bg-indigo-950/30 rounded px-3 py-1.5">
                Fix: {issue.suggestion}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
