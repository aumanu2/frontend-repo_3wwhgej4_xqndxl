import { useEffect, useState } from 'react'
import { useProject } from '../context/ProjectContext'
import { Plus } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Relationships() {
  const { activeProject } = useProject()
  const [rels, setRels] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', rel_type: 'One-to-Many', source_table_id: '', target_table_id: '', on_delete: 'NO ACTION', on_update: 'NO ACTION' })

  const pid = activeProject?._id

  const refresh = async () => {
    const data = await fetch(`${API}/relationships?project_id=${pid}`).then(r=>r.json())
    setRels(data)
  }

  useEffect(()=>{ if(pid) refresh() }, [pid])

  const create = async () => {
    await fetch(`${API}/relationships`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ project_id: pid, ...form }) })
    setOpen(false); setForm({ name: '', rel_type: 'One-to-Many', source_table_id: '', target_table_id: '', on_delete: 'NO ACTION', on_update: 'NO ACTION' })
    refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Relationships — {activeProject?.name}</h1>
        <button onClick={()=>setOpen(true)} className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-3 py-2 rounded-md"><Plus size={16}/> Add Relationship</button>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Source Table</th>
              <th className="p-3">Target Table</th>
              <th className="p-3">On Delete</th>
              <th className="p-3">On Update</th>
            </tr>
          </thead>
          <tbody>
            {rels.map(r => (
              <tr key={r._id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.rel_type}</td>
                <td className="p-3">{r.source_table_id}</td>
                <td className="p-3">{r.target_table_id}</td>
                <td className="p-3">{r.on_delete}</td>
                <td className="p-3">{r.on_update}</td>
              </tr>
            ))}
            {rels.length===0 && (
              <tr><td className="p-4 text-slate-500" colSpan="6">No relationships defined</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 grid place-items-center bg-black/40" onClick={()=>setOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 w-full max-w-lg" onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Add Relationship</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name"><input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent"/></Field>
              <Field label="Type">
                <select value={form.rel_type} onChange={e=>setForm({...form, rel_type: e.target.value})} className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent">
                  {['One-to-One','One-to-Many','Many-to-Many'].map(o=> <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Source Table"><input value={form.source_table_id} onChange={e=>setForm({...form, source_table_id: e.target.value})} className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent"/></Field>
              <Field label="Target Table"><input value={form.target_table_id} onChange={e=>setForm({...form, target_table_id: e.target.value})} className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent"/></Field>
              <Field label="On Delete">
                <select value={form.on_delete} onChange={e=>setForm({...form, on_delete: e.target.value})} className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent">
                  {['NO ACTION','CASCADE','SET NULL','RESTRICT'].map(o=> <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="On Update">
                <select value={form.on_update} onChange={e=>setForm({...form, on_update: e.target.value})} className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent">
                  {['NO ACTION','CASCADE','SET NULL','RESTRICT'].map(o=> <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setOpen(false)} className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800">Cancel</button>
              <button onClick={create} className="px-3 py-2 rounded-md bg-[#2563EB] text-white">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="text-sm">
      <div className="text-slate-500 mb-1">{label}</div>
      {children}
    </label>
  )
}
