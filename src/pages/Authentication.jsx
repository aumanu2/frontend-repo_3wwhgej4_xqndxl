import { useEffect, useState } from 'react'
import { useProject } from '../context/ProjectContext'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Authentication() {
  const { activeProject } = useProject()
  const [settings, setSettings] = useState(null)
  const [roles, setRoles] = useState([])
  const [roleOpen, setRoleOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', permissions: '' })
  const pid = activeProject?._id

  const refresh = async () => {
    const [s, r] = await Promise.all([
      fetch(`${API}/auth-settings?project_id=${pid}`).then(r=>r.json()),
      fetch(`${API}/roles?project_id=${pid}`).then(r=>r.json()),
    ])
    setSettings(s[0])
    setRoles(r)
  }

  useEffect(()=>{ if(pid) refresh() }, [pid])

  const toggle = async (key) => {
    const next = { ...settings, [key]: !settings[key] }
    setSettings(next)
    await fetch(`${API}/auth-settings/${settings._id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ [key]: next[key] }) })
  }

  const addRole = async () => {
    await fetch(`${API}/roles`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ project_id: pid, name: form.name, description: form.description, permissions: form.permissions.split(',').map(s=>s.trim()).filter(Boolean) }) })
    setRoleOpen(false); setForm({ name: '', description: '', permissions: '' }); refresh()
  }

  if (!activeProject) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Authentication — {activeProject?.name}</h1>

      {!settings ? (
        <div className="text-sm text-slate-500">Loading settings…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleCard label="JWT Authentication" value={settings.jwt_enabled} onChange={()=>toggle('jwt_enabled')} />
          <ToggleCard label="OAuth2 Google" value={settings.oauth_google} onChange={()=>toggle('oauth_google')} />
          <ToggleCard label="OAuth2 GitHub" value={settings.oauth_github} onChange={()=>toggle('oauth_github')} />
          <ToggleCard label="OAuth2 Microsoft" value={settings.oauth_microsoft} onChange={()=>toggle('oauth_microsoft')} />
        </div>
      )}

      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="p-4 flex items-center justify-between">
          <h3 className="font-semibold">Roles</h3>
          <button onClick={()=>setRoleOpen(true)} className="px-3 py-1.5 rounded-md bg-[#2563EB] text-white">Add Role</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="p-3">Role Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Permissions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(r => (
                <tr key={r._id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.description}</td>
                  <td className="p-3">{(r.permissions||[]).join(', ')}</td>
                </tr>
              ))}
              {roles.length===0 && <tr><td className="p-4 text-slate-500" colSpan="3">No roles yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {roleOpen && (
        <div className="fixed inset-0 grid place-items-center bg-black/40" onClick={()=>setRoleOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 w-full max-w-md" onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Add Role</h3>
            <div className="space-y-3">
              <Field label="Role Name"><input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent" /></Field>
              <Field label="Description"><input value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent" /></Field>
              <Field label="Permissions (comma-separated)"><input value={form.permissions} onChange={e=>setForm({...form, permissions: e.target.value})} className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent" /></Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setRoleOpen(false)} className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800">Cancel</button>
              <button onClick={addRole} className="px-3 py-2 rounded-md bg-[#2563EB] text-white">Create Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ToggleCard({ label, value, onChange }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-slate-500">Enable or disable</div>
      </div>
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={value} onChange={onChange} />
        <div className="w-10 h-6 bg-slate-200 peer-checked:bg-[#2563EB] rounded-full relative transition">
          <div className="absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition peer-checked:translate-x-4" />
        </div>
      </label>
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
