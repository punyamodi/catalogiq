import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { BarChart3, Upload, Clock, GitCompare, Settings, Zap } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Home', icon: Zap },
  { path: '/analyze', label: 'Analyze', icon: Upload },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/compare', label: 'Compare', icon: GitCompare },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">CatalogIQ</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === path
                  ? 'bg-indigo-600/20 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
