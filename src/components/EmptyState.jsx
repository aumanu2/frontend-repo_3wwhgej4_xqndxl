import { useProject } from '../context/ProjectContext'
import { Plus } from 'lucide-react'

export default function EmptyState() {
  const { openCreateModal } = useProject()
  return (
    <div className="h-[70vh] grid place-items-center">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-semibold mb-2">No project selected. Please create or select a project to continue.</h2>
        <button onClick={openCreateModal} className="mt-4 inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          <Plus size={16} /> Select Project
        </button>
      </div>
    </div>
  )
}
