import { useEffect, useState } from 'react'
import { useProject } from '../context/ProjectContext'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard() {
  const { activeProject } = useProject()
  const [stats, setStats] = useState({ tables: 0, relationships: 0, apis: 0, lastDeployment: '—', activity: [] })

  useEffect(() => {
    if (!activeProject) return
    const pid = activeProject._id || activeProject.id
    Promise.all([
      fetch(`${API}/tables?project_id=${pid}`).then(r=>r.json()),
      fetch(`${API}/relationships?project_id=${pid}`).then(r=>r.json()),
      fetch(`${API}/api-endpoints?project_id=${pid}`).then(r=>r.json()),
      fetch(`${API}/deployments?project_id=${pid}`).then(r=>r.json()),
      fetch(`${API}/activity?project_id=${pid}`).then(r=>r.json()),
    ]).then(([t, rel, api, dep, act]) => {
      const last = dep.find(d=>d.environment==='Production') || dep[0]
      setStats({ tables: t.length, relationships: rel.length, apis: api.length, lastDeployment: last?.status || '—', activity: act.slice(0, 5) })
    })
  }, [activeProject])

  if (!activeProject) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard — {activeProject.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tables" value={stats.tables} />
        <StatCard title="Total Relationships" value={stats.relationships} />
        <StatCard title="Active API Endpoints" value={stats.apis} />
        <StatCard title="Last Deployment Status" value={stats.lastDeployment} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Recent Activity</h2>
          <button className="text-sm px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800">View Logs</button>
        </div>
        {stats.activity.length === 0 ? (
          <div className="text-sm text-slate-500">No recent activity</div>
        ) : (
          <ul className="text-sm space-y-1">
            {stats.activity.map((a) => (
              <li key={a._id} className="flex items-center justify-between">
                <span>{a.action}</span>
                <span className="text-slate-500">{a.level}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="text-slate-500 text-sm">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  )
}
