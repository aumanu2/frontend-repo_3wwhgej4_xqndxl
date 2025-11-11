import { useEffect, useState } from 'react'
import { ChevronDown, CirclePlus } from 'lucide-react'
import { useProject } from '../../context/ProjectContext'

export default function ProjectSelector() {
  const { projects, activeProject, selectProject, openCreateModal, showCreate, closeCreateModal, createProject, refresh } = useProject()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', db_type: 'MongoDB', region: 'us-east-1' })

  useEffect(() => {
    const listener = () => setOpen(false)
    window.addEventListener('click', listener)
    return () => window.removeEventListener('click', listener)
  }, [])

  return (
    <div className="relative">
      <button onClick={(e)=>{e.stopPropagation(); setOpen(!open)}} className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
        <div className="text-left">
          <div className="text-xs text-slate-500">Project</div>
          <div className="font-medium">{activeProject ? activeProject.name : 'Select a project'}</div>
        </div>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-2 space-y-1">
          <button onClick={(e)=>{e.stopPropagation(); openCreateModal(); setOpen(false)}} className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-left">
            <CirclePlus size={16} /> New Project
          </button>
          <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
          {projects.length === 0 && (
            <div className="text-sm text-slate-500 px-2 py-2">No projects yet</div>
          )}
          {projects.map(p => (
            <button key={p._id} onClick={(e)=>{e.stopPropagation(); selectProject(p); setOpen(false)}} className="w-full px-2 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.db_type} • {p.region}</div>
                </div>
                <div className={`h-2 w-2 rounded-full ${p.status === 'active' ? 'bg-emerald-500' : p.status==='provisioning' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={closeCreateModal}>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 w-full max-w-md" onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Create Project</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-500">Project Name</label>
                <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2" />
              </div>
              <div>
                <label className="text-sm text-slate-500">Database Type</label>
                <select value={form.db_type} onChange={e=>setForm({...form, db_type: e.target.value})} className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2">
                  <option>PostgreSQL</option>
                  <option>MySQL</option>
                  <option>MongoDB</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-500">Hosting Region</label>
                <select value={form.region} onChange={e=>setForm({...form, region: e.target.value})} className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2">
                  <option>us-east-1</option>
                  <option>us-west-2</option>
                  <option>eu-central-1</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeCreateModal} className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800">Cancel</button>
              <button onClick={()=> createProject(form)} className="px-3 py-2 rounded-md bg-[#2563EB] text-white">Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
