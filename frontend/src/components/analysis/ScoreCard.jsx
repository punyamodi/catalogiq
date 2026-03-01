import { clsx } from 'clsx'
import { scoreColor, scoreGrade, scoreLabel, scoreBgColor } from '../../utils/helpers'

export default function ScoreCard({ score, label, size = 'md' }) {
  const pct = Math.round(score)
  const circumference = 2 * Math.PI * 45

  return (
    <div className={clsx('card p-4 flex flex-col items-center gap-2', size === 'lg' && 'p-6')}>
      <div className="relative">
        <svg
          className={clsx('transform -rotate-90', size === 'lg' ? 'w-32 h-32' : 'w-24 h-24')}
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            stroke={score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct / 100)}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={clsx('font-bold leading-none', scoreColor(score), size === 'lg' ? 'text-3xl' : 'text-xl')}>
            {pct}
          </span>
          <span className={clsx('text-slate-500 font-semibold', size === 'lg' ? 'text-sm' : 'text-xs')}>
            {scoreGrade(score)}
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className={clsx('font-medium', size === 'lg' ? 'text-base' : 'text-sm')}>{label}</p>
        <p className={clsx('text-xs', scoreColor(score))}>{scoreLabel(score)}</p>
      </div>
    </div>
  )
}
