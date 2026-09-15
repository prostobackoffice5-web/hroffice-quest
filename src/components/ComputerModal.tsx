import { useMemo, useState } from 'react'
import { ModalShell } from './ModalShell'
import { TaskForm } from './TaskForm'
import { TaskCard } from './TaskCard'
import { useStore } from '../store'
import { uid } from '../utils'
import type { Project } from '../types'

type Tab = 'all' | 'active' | 'done' | 'projects'

function ProjectView({ project, onBack }: { project: Project; onBack: () => void }) {
  const { state, dispatch } = useStore()
  const [creating, setCreating] = useState(false)
  const subtasks = state.tasks.filter((t) => t.projectId === project.id)
  const done = subtasks.filter((t) => t.status === 'done').length

  return (
    <div className="space-y-3">
      <button onClick={onBack} className="text-sm text-[#d8c9a8] hover:text-white">← Назад к проектам</button>
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-[#f3e9d2]">{project.title}</div>
        <div className="text-sm text-[#d8c9a8]">{done}/{subtasks.length}</div>
      </div>
      <div className="space-y-2">
        {subtasks.map((t) => (
          <TaskCard key={t.id} task={t} onDelete={() => dispatch({ type: 'DELETE_TASK', id: t.id })} />
        ))}
        {subtasks.length === 0 && <div className="text-sm text-[#d8c9a8]">Подзадач пока нет</div>}
      </div>
      <button onClick={() => setCreating(true)} className="pixel-btn bg-[#4a3826] text-[#f3e9d2] text-sm px-3 py-2">
        Создать подзадачу
      </button>
      {creating && <TaskForm projectId={project.id} onClose={() => setCreating(false)} />}
    </div>
  )
}

export function ComputerModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore()
  const [tab, setTab] = useState<Tab>('all')
  const [creating, setCreating] = useState(false)
  const [projectTitle, setProjectTitle] = useState('')
  const [openProjectId, setOpenProjectId] = useState<string | null>(null)

  const tasks = useMemo(() => {
    return state.tasks
      .filter((t) => !t.projectId)
      .filter((t) => (tab === 'active' ? t.status === 'active' : tab === 'done' ? t.status === 'done' : true))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [state.tasks, tab])

  const openProject = state.projects.find((p) => p.id === openProjectId)

  return (
    <ModalShell title="Задания" onClose={onClose} wide>
      <div className="flex gap-1 mb-3">
        {(['all', 'active', 'done', 'projects'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setOpenProjectId(null) }}
            className={`pixel-btn text-sm px-3 py-1.5 ${tab === t ? 'bg-[#6b4f32] text-white' : 'bg-[#4a3826] text-[#d8c9a8]'}`}
          >
            {t === 'all' ? 'Все' : t === 'active' ? 'Активные' : t === 'done' ? 'Выполненные' : 'Проекты'}
          </button>
        ))}
      </div>

      {tab !== 'projects' && (
        <div className="space-y-2">
          <button onClick={() => setCreating(true)} className="pixel-btn bg-[#4a3826] text-[#f3e9d2] text-sm px-3 py-2 mb-1">
            Создать задание
          </button>
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} onDelete={() => dispatch({ type: 'DELETE_TASK', id: t.id })} />
          ))}
          {tasks.length === 0 && <div className="text-sm text-[#d8c9a8]">Заданий пока нет</div>}
        </div>
      )}

      {tab === 'projects' && !openProject && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Название проекта"
              className="flex-1 pixel-slot px-3 py-2 outline-none text-[#f3e9d2]"
            />
            <button
              onClick={() => {
                if (!projectTitle.trim()) return
                const project: Project = { id: uid('proj'), title: projectTitle.trim(), createdAt: new Date().toISOString() }
                dispatch({ type: 'ADD_PROJECT', project })
                setProjectTitle('')
              }}
              className="pixel-btn bg-[#3f7d3a] text-white text-sm px-3 py-2"
            >
              Создать проект
            </button>
          </div>
          <div className="space-y-2">
            {state.projects.map((p) => {
              const subtasks = state.tasks.filter((t) => t.projectId === p.id)
              const done = subtasks.filter((t) => t.status === 'done').length
              return (
                <button key={p.id} onClick={() => setOpenProjectId(p.id)} className="pixel-panel w-full text-left p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#f3e9d2]">{p.title}</span>
                    <span className="text-sm text-[#d8c9a8]">{done}/{subtasks.length}</span>
                  </div>
                </button>
              )
            })}
            {state.projects.length === 0 && <div className="text-sm text-[#d8c9a8]">Проектов пока нет</div>}
          </div>
        </div>
      )}

      {tab === 'projects' && openProject && <ProjectView project={openProject} onBack={() => setOpenProjectId(null)} />}

      {creating && <TaskForm onClose={() => setCreating(false)} />}
    </ModalShell>
  )
}
