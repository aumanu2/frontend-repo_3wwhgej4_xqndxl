import { Bell, Moon, Sun, User } from 'lucide-react'
import ProjectSelector from './project/ProjectSelector'
import { useTheme } from '../hooks/useTheme'

export function Topbar() {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-30 h-14 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded bg-[#0F172A]" />
        <span className="font-semibold text-slate-900 dark:text-white">BackendForge</span>
      </div>
      <div className="w-full max-w-lg">
        <ProjectSelector />
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggle} className="h-9 w-9 inline-grid place-items-center rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="h-9 w-9 inline-grid place-items-center rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
          <Bell size={18} />
        </button>
        <div className="h-9 w-9 inline-grid place-items-center rounded-full bg-slate-200/70 dark:bg-slate-700/70">
          <User size={18} />
        </div>
      </div>
    </header>
  )
}
