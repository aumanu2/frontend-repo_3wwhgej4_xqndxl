import { useEffect, useState } from 'react'
import { useProject } from '../context/ProjectContext'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Deployment() {
  const { activeProject } = useProject()
  const [envs, setEnvs] = useState([])
  const [logs, setLogs] = useState({ open: false, text: '' })

  const pid = activeProject?._id

  const refresh = async () => {
    const d = await fetch(`${API}/deployments?project_id=${pid}`).then(r=>r.json())
    setEnvs(d)
  }

  useEffect(()=>{ if(pid) refresh() }, [pid])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Deployment — {activeProject?.name}</h1>
        <button className="px-3 py-2 rounded-md bg-[#2563EB] text-white">Deploy Now</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {envs.map(e => (
          <div key={e._id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{e.environment}</div>
              <div className={`text-xs px-2 py-0.5 rounded-full ${e.status==='Success'?'bg-emerald-100 text-emerald-700': e.status==='Failed'? 'bg-rose-100 text-rose-700':'bg-amber-100 text-amber-700'}`}>{e.status}</div>
            </div>
            <div className="text-sm text-slate-500 mt-2">Last Deployed Time: —</div>
            <div className="mt-3 flex gap-2">
              <button onClick={()=> setLogs({ open: true, text: e.logs || 'No logs yet' })} className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800">Logs</button>
            </div>
          </div>
        ))}
      </div>

      {logs.open && (
        <div className="fixed inset-0 grid place-items-center bg-black/40" onClick={()=>setLogs({ open:false, text:'' })}>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Deployment Logs</h3>
            <pre className="text-xs whitespace-pre-wrap max-h-[60vh] overflow-auto">{logs.text}</pre>
            <div className="mt-4 text-right"><button onClick={()=>setLogs({ open:false, text:'' })} className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800">Close</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
