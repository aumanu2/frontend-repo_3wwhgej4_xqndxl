import { useEffect, useState } from 'react'
import { useProject } from '../context/ProjectContext'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Settings() {
  const { activeProject } = useProject()
  const [tab, setTab] = useState('General')
  const [apiKeys, setApiKeys] = useState([])
  const [team, setTeam] = useState([])

  const pid = activeProject?._id

  useEffect(()=>{
    if (!pid) return
    Promise.all([
      fetch(`${API}/api-keys?project_id=${pid}`).then(r=>r.json()),
      fetch(`${API}/team-members?project_id=${pid}`).then(r=>r.json()),
    ]).then(([k, t])=> { setApiKeys(k); setTeam(t) })
  }, [pid])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings — {activeProject?.name}</h1>

      <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        {['General','API Keys','Team','Billing'].map(t => (
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1.5 ${tab===t? 'bg-[#2563EB] text-white' : ''}`}>{t}</button>
        ))}
      </div>

      {tab === 'General' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Project Name"><input defaultValue={activeProject?.name} className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent"/></Field>
          <Field label="Description"><input className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent"/></Field>
          <Field label="Region"><input defaultValue={activeProject?.region} className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent"/></Field>
          <Field label="DB Type"><input defaultValue={activeProject?.db_type} className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent"/></Field>
        </div>
      )}

      {tab === 'API Keys' && (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="p-3">Key Name</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Last Used</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map(k => (
                <tr key={k._id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="p-3">{k.name}</td>
                  <td className="p-3">—</td>
                  <td className="p-3">—</td>
                  <td className="p-3"><button className="px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-800">Copy</button> <button className="px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 ml-2">Revoke</button></td>
                </tr>
              ))}
              {apiKeys.length===0 && <tr><td className="p-4 text-slate-500" colSpan="4">No API keys yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Team' && (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {team.map(m => (
                <tr key={m._id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="p-3">{m.name}</td>
                  <td className="p-3">{m.role}</td>
                  <td className="p-3">{m.status}</td>
                </tr>
              ))}
              {team.length===0 && <tr><td className="p-4 text-slate-500" colSpan="3">No team members</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Billing' && (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="font-semibold mb-2">Plan</div>
          <div className="text-sm text-slate-500">Free plan — upgrade to unlock more limits</div>
          <button className="mt-3 px-3 py-2 rounded-md bg-[#2563EB] text-white">Upgrade Plan</button>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="text-sm w-full block">
      <div className="text-slate-500 mb-1">{label}</div>
      {children}
    </label>
  )
}
