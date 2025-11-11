import { useEffect, useMemo, useState } from 'react'
import { useProject } from '../context/ProjectContext'
import { Plus, Save, Undo2 } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const emptyColumn = () => ({ name: '', data_type: 'String', primary_key: false, required: false, default_value: '', relation: null, description: '' })

export default function Tables() {
  const { activeProject } = useProject()
  const [tables, setTables] = useState([])
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const pid = activeProject?._id

  const fetchTables = async () => {
    if (!pid) return
    const res = await fetch(`${API}/tables?project_id=${pid}`)
    const data = await res.json()
    setTables(data)
  }

  useEffect(()=>{ fetchTables() }, [pid])

  const addTable = async () => {
    if (!newName.trim()) return
    await fetch(`${API}/tables`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ project_id: pid, name: newName, columns: [] }) })
    setOpen(false); setNewName('')
    fetchTables()
  }

  const updateTable = async (t) => {
    await fetch(`${API}/tables/${t._id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: t.name, description: t.description, columns: t.columns }) })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Database Tables — {activeProject?.name}</h1>
        <button onClick={()=>setOpen(true)} className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-3 py-2 rounded-md"><Plus size={16}/> Add Table</button>
      </div>
      <div className="space-y-4">
        {tables.length === 0 && (
          <div className="text-sm text-slate-500">No tables yet, click Add Table to begin</div>
        )}
        {tables.map((t, idx)=> (
          <TableCard key={t._id} table={t} onChange={(nt)=>{
            const cloned = [...tables]; cloned[idx] = nt; setTables(cloned)
          }} onSave={updateTable} />
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 grid place-items-center bg-black/40" onClick={()=>setOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 w-full max-w-md" onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Add Table</h3>
            <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2" placeholder="Table name" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setOpen(false)} className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800">Cancel</button>
              <button onClick={addTable} className="px-3 py-2 rounded-md bg-[#2563EB] text-white">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TableCard({ table, onChange, onSave }) {
  const [expanded, setExpanded] = useState(true)

  const addColumn = () => {
    onChange({ ...table, columns: [...(table.columns||[]), emptyColumn()] })
  }

  const save = () => onSave(table)

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="p-4 flex items-center justify-between">
        <div>
          <input value={table.name} onChange={e=>onChange({ ...table, name: e.target.value })} className="text-lg font-semibold bg-transparent" />
          <p className="text-sm text-slate-500">{table.description || '—'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={save} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800"><Save size={14}/> Save Changes</button>
          <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800"><Undo2 size={14}/> Discard</button>
        </div>
      </div>
      {expanded && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-12 text-xs text-slate-500 px-2 py-1">
            <div className="col-span-3">Column Name</div>
            <div className="col-span-2">Data Type</div>
            <div className="col-span-1">PK</div>
            <div className="col-span-1">Req</div>
            <div className="col-span-2">Default</div>
            <div className="col-span-2">Relation</div>
            <div className="col-span-1">Description</div>
          </div>
          <div className="space-y-2">
            {(table.columns||[]).map((col, i)=> (
              <div key={i} className="grid grid-cols-12 gap-2 items-center px-2">
                <input value={col.name} onChange={e=>onChange({ ...table, columns: table.columns.map((c,idx)=> idx===i? { ...c, name: e.target.value }: c) })} className="col-span-3 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent" />
                <select value={col.data_type} onChange={e=>onChange({ ...table, columns: table.columns.map((c,idx)=> idx===i? { ...c, data_type: e.target.value }: c) })} className="col-span-2 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent">
                  {['String','Integer','Boolean','Date','JSON','Enum'].map(dt => <option key={dt}>{dt}</option>)}
                </select>
                <input type="checkbox" checked={col.primary_key} onChange={e=>onChange({ ...table, columns: table.columns.map((c,idx)=> idx===i? { ...c, primary_key: e.target.checked }: c) })} className="col-span-1" />
                <input type="checkbox" checked={col.required} onChange={e=>onChange({ ...table, columns: table.columns.map((c,idx)=> idx===i? { ...c, required: e.target.checked }: c) })} className="col-span-1" />
                <input value={col.default_value} onChange={e=>onChange({ ...table, columns: table.columns.map((c,idx)=> idx===i? { ...c, default_value: e.target.value }: c) })} className="col-span-2 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent" />
                <input value={col.relation||''} onChange={e=>onChange({ ...table, columns: table.columns.map((c,idx)=> idx===i? { ...c, relation: e.target.value }: c) })} className="col-span-2 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent" />
                <input value={col.description} onChange={e=>onChange({ ...table, columns: table.columns.map((c,idx)=> idx===i? { ...c, description: e.target.value }: c) })} className="col-span-1 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent" />
              </div>
            ))}
            <div>
              <button onClick={addColumn} className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800"><Plus size={14}/> Add Column</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
