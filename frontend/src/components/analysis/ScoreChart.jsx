import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts'
import { scoreColor } from '../../utils/helpers'

const RADAR_LABELS = {
  content_score: 'Content',
  readability_score: 'Readability',
  structure_score: 'Structure',
  product_info_score: 'Product Info',
  formatting_score: 'Formatting',
}

const BAR_COLOR = (score) => {
  if (score >= 75) return '#22c55e'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

export function RadarScoreChart({ scores }) {
  const data = Object.entries(RADAR_LABELS).map(([key, name]) => ({
    subject: name,
    score: scores[key] || 0,
    fullMark: 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="#1e293b" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
          itemStyle={{ color: '#e2e8f0' }}
          formatter={(v) => [`${v}/100`, 'Score']}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export function BarScoreChart({ scores }) {
  const data = Object.entries(RADAR_LABELS).map(([key, name]) => ({
    name,
    score: Math.round(scores[key] || 0),
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
          itemStyle={{ color: '#e2e8f0' }}
          formatter={(v) => [`${v}/100`, 'Score']}
        />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={BAR_COLOR(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
