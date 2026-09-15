import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../store'
import { QuestModal } from './QuestModal'
import { QuestCard } from './QuestCard'
import type { Project, Quest } from '../types'
import { uid } from '../utils'

function ProjectCreateInline({ onClose }: { onClose: () => void }) {
  const { dispatch } = useStore()
  const [title, setTitle] = useState('')
  return (
    <div className="pixel-border bg-[#241a40] p-4 flex gap-2 items-center">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название проекта"
        className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-purple-300/50 outline-none"
      />
      <button
        onClick={() => {
          if (!title.trim()) return
          const project: Project = {
            id: uid('proj'),
            title: title.trim(),
            icon: '🏰',
            ownerId: 'arai',
            participants: ['arai', 'linara'],
            createdAt: new Date().toISOString(),
          }
          dispatch({ type: 'ADD_PROJECT', project })
          onClose()
        }}
        className="rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-sm font-semibold px-3 py-2"
      >
        Создать
      </button>
      <button onClick={onClose} className="text-purple-300 text-sm px-2">Отмена</button>
    </div>
  )
}

function ProjectCard({ projectId }: { projectId: string }) {
  const { state } = useStore()
  const project = state.projects.find((p) => p.id === projectId)!
  const [addingQuest, setAddingQuest] = useState(false)
  const [editing, setEditing] = useState<Quest | null | undefined>(undefined)
  const questsInProject = state.quests.filter((q) => q.projectId === projectId)
  const done = questsInProject.filter((q) => q.status === 'done').length
  const total = questsInProject.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="pixel-border bg-[#241a40] p-4">
      <div className="flex items-center justify-between mb-1">
        <div className="text-white font-semibold">{project.icon} {project.title}</div>
        <div className="text-xs text-purple-300">{done}/{total} · {pct}%</div>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-3">
        <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {questsInProject.map((q) => (
          <QuestCard key={q.id} quest={q} onEdit={(qq) => setEditing(qq)} />
        ))}
      </div>
      <button
        onClick={() => setAddingQuest(true)}
        className="flex items-center gap-1 mt-3 text-sm text-purple-200 hover:text-white"
      >
        <Plus size={14} /> Добавить квест в проект
      </button>
      {addingQuest && <QuestModal quest={null} defaultProjectId={projectId} onClose={() => setAddingQuest(false)} />}
      {editing !== undefined && <QuestModal quest={editing} onClose={() => setEditing(undefined)} />}
    </div>
  )
}

export function Projects() {
  const { state } = useStore()
  const [creating, setCreating] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">🏰 Projects</h2>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-sm font-semibold px-3 py-1.5"
        >
          <Plus size={16} /> New Project
        </button>
      </div>
      {creating && <ProjectCreateInline onClose={() => setCreating(false)} />}
      {state.projects.map((p) => (
        <ProjectCard key={p.id} projectId={p.id} />
      ))}
      {state.projects.length === 0 && <div className="text-purple-300/60 text-sm text-center py-10">Проектов пока нет</div>}
    </div>
  )
}
