import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'

export default function AnalysisDetails({ strengths, weaknesses, recommendations }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card p-4 space-y-3">
        <h3 className="font-semibold text-green-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Strengths
        </h3>
        {strengths.length ? (
          <ul className="space-y-1.5">
            {strengths.map((s, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-sm">No strengths identified.</p>
        )}
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="font-semibold text-red-400 flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          Weaknesses
        </h3>
        {weaknesses.length ? (
          <ul className="space-y-1.5">
            {weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">-</span>
                {w}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-sm">No weaknesses identified.</p>
        )}
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="font-semibold text-indigo-400 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Recommendations
        </h3>
        {recommendations.length ? (
          <ul className="space-y-1.5">
            {recommendations.map((r, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-indigo-400 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-sm">No recommendations available.</p>
        )}
      </div>
    </div>
  )
}
