import { useEffect, useState } from 'react'
import { useProject } from '../context/ProjectContext'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Analytics() {
  const { activeProject } = useProject()
  const [usage, setUsage] = useState([])
  const [range, setRange] = useState('7d')

  useEffect(()=>{
    if (!activeProject) return
    const pid = activeProject._id
    fetch(`${API}/analytics?project_id=${pid}`).then(r=>r.json()).then(setUsage)
  }, [activeProject, range])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics — {activeProject?.name}</h1>
        <select value={range} onChange={e=>setRange(e.target.value)} className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent">
          <option value="1h">Last hour</option>
          <option value="24h">24 hours</option>
          <option value="7d">7 days</option>
          <option value="30d">30 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartCard title="API usage" data={usage.filter(p=>p.metric==='api_usage')} />
        <ChartCard title="Response time" data={usage.filter(p=>p.metric==='response_time')} />
        <ChartCard title="Error rate" data={usage.filter(p=>p.metric==='error_rate')} />
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="p-3">Endpoint</th>
              <th className="p-3">Requests</th>
              <th className="p-3">Avg Latency</th>
              <th className="p-3">Success Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200 dark:border-slate-800">
              <td className="p-3">/api/items</td>
              <td className="p-3">1,240</td>
              <td className="p-3">120ms</td>
              <td className="p-3">99.2%</td>
            </tr>
            <tr className="border-t border-slate-200 dark:border-slate-800">
              <td className="p-3">/auth/login</td>
              <td className="p-3">640</td>
              <td className="p-3">80ms</td>
              <td className="p-3">98.7%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ChartCard({ title, data }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="font-semibold mb-2">{title}</div>
      <div className="h-36 grid place-items-center text-slate-500 text-sm">Chart placeholder ({data.length} pts)</div>
    </div>
  )
}
