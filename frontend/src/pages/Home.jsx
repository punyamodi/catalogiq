import { Link } from 'react-router-dom'
import { Upload, BarChart3, Clock, GitCompare, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'PDF Upload',
    description: 'Drag and drop PDF catalogs for instant analysis. Supports files up to 50 MB.',
  },
  {
    icon: BarChart3,
    title: 'Multi-Dimensional Scoring',
    description: 'Evaluate content, readability, structure, product info, and formatting independently.',
  },
  {
    icon: Clock,
    title: 'Analysis History',
    description: 'Every analysis is saved. Review, compare, and track quality improvements over time.',
  },
  {
    icon: GitCompare,
    title: 'Side-by-Side Comparison',
    description: 'Compare two catalogs directly and see where each one leads or falls short.',
  },
  {
    icon: Shield,
    title: 'Detailed Issue Reports',
    description: 'Severity-ranked issues with actionable fix suggestions for every problem found.',
  },
  {
    icon: Zap,
    title: 'Multiple LLM Providers',
    description: 'Works with HuggingFace, OpenAI, or a local Ollama instance — your choice.',
  },
]

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center py-12 space-y-6">
        <div className="inline-flex items-center gap-2 bg-indigo-950/50 border border-indigo-800/50 rounded-full px-4 py-1.5 text-indigo-400 text-sm font-medium">
          <Zap className="w-3.5 h-3.5" />
          AI-Powered Quality Analysis
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
          <span className="gradient-text">CatalogIQ</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Instantly score and improve your product catalogs using advanced AI. Get dimension-level
          insights, issue reports, and actionable recommendations.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/analyze" className="btn-primary text-base px-6 py-3">
            Analyze a Catalog
          </Link>
          <Link to="/history" className="btn-secondary text-base px-6 py-3">
            View History
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="card-hover p-5 space-y-3">
            <div className="w-10 h-10 bg-indigo-950/50 border border-indigo-800/50 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-slate-100">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
          </div>
        ))}
      </section>

      <section className="card p-6 sm:p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
          {[
            { step: '1', title: 'Upload', desc: 'Drop your PDF catalog into the upload zone' },
            { step: '2', title: 'Analyze', desc: 'AI extracts and evaluates content across 5 dimensions' },
            { step: '3', title: 'Improve', desc: 'Review scores, issues, and recommendations to enhance quality' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto text-lg">
                {step}
              </div>
              <h4 className="font-semibold">{title}</h4>
              <p className="text-slate-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
