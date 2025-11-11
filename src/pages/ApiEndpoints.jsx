import { useEffect, useState } from 'react'
import { useProject } from '../context/ProjectContext'
import { Copy, Play } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ApiEndpoints() {
  const { activeProject } = useProject()
  const [tab, setTab] = useState('REST')
  const [endpoints, setEndpoints] = useState([])
  const [schema, setSchema] = useState(null)
  const [drawer, setDrawer] = useState({ open: false, method: 'GET', url: '', body: '' })

  const pid = activeProject?._id

  useEffect(()=> {
    if (!pid) return
    fetch(`${API}/api-endpoints?project_id=${pid}`).then(r=>r.json()).then(setEndpoints)
    fetch(`${API}/graphql-schemas?project_id=${pid}`).then(r=>r.json()).then(d=>setSchema(d[0]))
  }, [pid])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">API Endpoints — {activeProject?.name}</h1>

      <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        {['REST','GraphQL'].map(t=> (
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1.5 ${tab===t? 'bg-[#2563EB] text-white' : ''}`}>{t}</button>
        ))}
      </div>

      {tab === 'REST' ? (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="p-3">Method</th>
                <th className="p-3">Endpoint URL</th>
                <th className="p-3">Auth</th>
                <th className="p-3">Description</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map(e => (
                <tr key={e._id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="p-3">{e.method}</td>
                  <td className="p-3 font-mono text-xs">{e.url}</td>
                  <td className="p-3">{e.auth_required? 'Yes':'No'}</td>
                  <td className="p-3">{e.description}</td>
                  <td className="p-3">
                    <button onClick={()=> setDrawer({ open: true, method: e.method, url: e.url, body: '' })} className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 mr-2"><Play size={14}/> Test</button>
                    <button className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-800"><Copy size={14}/> Docs</button>
                  </td>
                </tr>
              ))}
              {endpoints.length===0 && <tr><td className="p-4 text-slate-500" colSpan="5">No endpoints yet</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Generated Schema</h3><button className="text-sm px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 inline-flex items-center gap-1"><Copy size={14}/> Copy Schema</button></div>
          <pre className="text-xs overflow-auto max-h-[50vh]">{JSON.stringify(schema?.schema || {}, null, 2)}</pre>
        </div>
      )}

      {drawer.open && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 z-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Test Endpoint</h3>
            <button onClick={()=> setDrawer({ ...drawer, open: false })}>Close</button>
          </div>
          <div className="mt-4 space-y-3">
            <div className="text-sm">
              <div className="text-slate-500">Method</div>
              <div className="font-medium">{drawer.method}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">URL</div>
              <input value={drawer.url} onChange={e=> setDrawer({ ...drawer, url: e.target.value })} className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Body</div>
              <textarea value={drawer.body} onChange={e=> setDrawer({ ...drawer, body: e.target.value })} rows={6} className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent" />
            </div>
            <button className="w-full bg-[#2563EB] text-white rounded-md py-2 inline-flex items-center justify-center gap-2"><Play size={16}/> Send Request</button>
          </div>
        </div>
      )}
    </div>
  )
}
