import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { getConfig, getHealth } from '../services/api'

export default function Settings() {
  const [config, setConfig] = useState(null)
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getConfig(), getHealth()])
      .then(([c, h]) => {
        setConfig(c)
        setHealth(h)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-400 mt-1">Current configuration and API status.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-slate-200">API Status</h2>
            <div className="flex items-center gap-2">
              {health?.status === 'healthy' ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={health?.status === 'healthy' ? 'text-green-400' : 'text-red-400'}>
                {health?.status === 'healthy' ? 'Backend is online' : 'Backend is unreachable'}
              </span>
            </div>
            <p className="text-slate-400 text-sm">Version: {health?.version ?? '—'}</p>
          </div>

          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-slate-200">LLM Configuration</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <span className="text-slate-400">Provider</span>
              <span className="text-slate-200 capitalize">{config?.llm_provider ?? '—'}</span>
              <span className="text-slate-400">Active Model</span>
              <span className="text-slate-200 font-mono text-xs">{config?.llm_model ?? '—'}</span>
              <span className="text-slate-400">Max File Size</span>
              <span className="text-slate-200">{config?.max_file_size_mb ?? '—'} MB</span>
            </div>
          </div>

          <div className="card p-5 space-y-3">
            <h2 className="font-semibold text-slate-200">Environment Setup</h2>
            <p className="text-slate-400 text-sm">
              To change the LLM provider or API keys, edit the{' '}
              <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 text-xs">.env</code> file in the
              backend directory and restart the server.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-1">
              <p className="text-slate-500"># HuggingFace (default)</p>
              <p>LLM_PROVIDER=huggingface</p>
              <p>HUGGINGFACE_API_TOKEN=your_token</p>
              <p className="mt-2 text-slate-500"># OpenAI</p>
              <p>LLM_PROVIDER=openai</p>
              <p>OPENAI_API_KEY=your_key</p>
              <p className="mt-2 text-slate-500"># Ollama (local)</p>
              <p>LLM_PROVIDER=ollama</p>
              <p>OLLAMA_MODEL=llama2</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
