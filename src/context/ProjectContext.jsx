import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const ProjectContext = createContext(null)

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [activeProject, setActiveProject] = useState(null)
  const [loadingProject, setLoadingProject] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  const fetchProjects = async () => {
    const res = await fetch(`${API_BASE}/projects`)
    const data = await res.json()
    setProjects(data)
  }

  useEffect(() => {
    fetchProjects()
    const stored = localStorage.getItem('bf_active_project')
    if (stored) setActiveProject(JSON.parse(stored))
    setLoadingProject(false)
  }, [])

  const openCreateModal = () => setShowCreate(true)
  const closeCreateModal = () => setShowCreate(false)

  const createProject = async (payload) => {
    const res = await fetch(`${API_BASE}/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    await fetchProjects()
    const newActive = { _id: data.id, ...payload }
    setActiveProject(newActive)
    localStorage.setItem('bf_active_project', JSON.stringify(newActive))
    setShowCreate(false)
    return data.id
  }

  const selectProject = async (proj) => {
    setLoadingProject(true)
    setTimeout(() => { // simulate loading overlay
      setActiveProject(proj)
      localStorage.setItem('bf_active_project', JSON.stringify(proj))
      setLoadingProject(false)
    }, 500)
  }

  const value = { projects, activeProject, loadingProject, selectProject, createProject, openCreateModal, closeCreateModal, showCreate, refresh: fetchProjects }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProject() {
  return useContext(ProjectContext)
}
