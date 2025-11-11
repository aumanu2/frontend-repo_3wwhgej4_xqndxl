import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { ProjectProvider, useProject } from './context/ProjectContext'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Tables from './pages/Tables'
import Relationships from './pages/Relationships'
import ApiEndpoints from './pages/ApiEndpoints'
import Authentication from './pages/Authentication'
import Deployment from './pages/Deployment'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import EmptyState from './components/EmptyState'

function ScopedRoutes() {
  const { activeProject, loadingProject } = useProject()
  const location = useLocation()

  const content = (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6">
          {(!activeProject && !loadingProject) ? (
            <EmptyState />
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/database" element={<Tables />} />
              <Route path="/relationships" element={<Relationships />} />
              <Route path="/api" element={<ApiEndpoints />} />
              <Route path="/auth" element={<Authentication />} />
              <Route path="/deployment" element={<Deployment />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  )

  return (
    <div className="font-sans" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
      {content}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <ScopedRoutes />
      </ProjectProvider>
    </BrowserRouter>
  )
}
