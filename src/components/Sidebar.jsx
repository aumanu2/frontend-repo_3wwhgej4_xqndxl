import { NavLink } from 'react-router-dom'
import { Activity, BarChart, Box, Cable, CloudUpload, Database, LayoutDashboard, Lock, Settings } from 'lucide-react'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/database', label: 'Database', icon: Database },
  { to: '/relationships', label: 'Relationships', icon: Cable },
  { to: '/api', label: 'API Endpoints', icon: Box },
  { to: '/auth', label: 'Authentication', icon: Lock },
  { to: '/deployment', label: 'Deployment', icon: CloudUpload },
  { to: '/analytics', label: 'Analytics', icon: BarChart },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
      <nav className="p-3 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-[#0F172A] dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-3 text-xs text-slate-500">v0.1.0</div>
    </aside>
  )
}
