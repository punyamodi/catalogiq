import { useNavigate } from 'react-router-dom'
import { Trash2, ExternalLink, FileText } from 'lucide-react'
import { clsx } from 'clsx'
import { formatDate, formatFileSize, scoreColor, scoreGrade } from '../../utils/helpers'

export default function HistoryTable({ analyses, onDelete, selectedIds, onToggleSelect }) {
  const navigate = useNavigate()

  if (!analyses.length) {
    return (
      <div className="card p-12 text-center text-slate-500">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No analyses yet. Upload a catalog to get started.</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/50">
            <th className="py-3 px-4 text-left w-8">
              <span className="sr-only">Select</span>
            </th>
            <th className="py-3 px-4 text-left text-slate-400 font-medium">File</th>
            <th className="py-3 px-4 text-center text-slate-400 font-medium">Score</th>
            <th className="py-3 px-4 text-center text-slate-400 font-medium hidden sm:table-cell">Pages</th>
            <th className="py-3 px-4 text-center text-slate-400 font-medium hidden md:table-cell">Words</th>
            <th className="py-3 px-4 text-left text-slate-400 font-medium hidden lg:table-cell">Analyzed</th>
            <th className="py-3 px-4 text-right text-slate-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {analyses.map((a) => (
            <tr
              key={a.id}
              className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
            >
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedIds?.includes(a.id) || false}
                  onChange={() => onToggleSelect?.(a.id)}
                  className="rounded accent-indigo-500"
                />
              </td>
              <td className="py-3 px-4">
                <span className="text-slate-200 font-medium truncate max-w-[180px] block">{a.filename}</span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={clsx('font-bold text-base', scoreColor(a.overall_score))}>
                  {Math.round(a.overall_score)}
                </span>
                <span className="text-slate-500 text-xs ml-1">{scoreGrade(a.overall_score)}</span>
              </td>
              <td className="py-3 px-4 text-center text-slate-400 hidden sm:table-cell">{a.page_count ?? '—'}</td>
              <td className="py-3 px-4 text-center text-slate-400 hidden md:table-cell">
                {a.word_count ? a.word_count.toLocaleString() : '—'}
              </td>
              <td className="py-3 px-4 text-slate-400 hidden lg:table-cell">{formatDate(a.created_at)}</td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigate(`/results/${a.id}`)}
                    className="text-slate-400 hover:text-indigo-400 transition-colors"
                    title="View results"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(a.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
