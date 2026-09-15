import { useMemo, useState } from 'react'
import { ModalShell } from './ModalShell'
import { TaskForm } from './TaskForm'
import { TaskCard } from './TaskCard'
import { useStore } from '../store'
import { uid } from '../utils'
import type { PlayerId, Project, Task } from '../types'

type Filter = 'all' | 'mine' | 'arai' | 'linara' | 'both' | 'active' | 'done' | 'overdue' | 'urgent'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'mine', label: 'Мои' },
  { id: 'arai', label: 'Арай' },
  { id: 'linara', label: 'Линара' },
  { id: 'both', label: 'Совместные' },
  { id: 'active', label: 'Активные' },
  { id: 'done', label: 'Выполненные' },
  { id: 'overdue', label: 'Просроченные' },
  { id: 'urgent', label: 'Срочные' },
]

function summaryFor(tasks: Task[], player: PlayerId) {
  const mine = tasks.filter((t) => t.assignee === player || t.assignee === 'both')
  return {
    inProgress: mine.filter((t) => t.status === 'in_progress').length,
    fresh: mine.filter((t) => t.status === 'new').length,
    review: mine.filter((t) => t.status === 'review').length,
    done: mine.filter((t) => t.status === 'done').length,
  }
}

function ProjectView({ project, onBack }: { project: Project; onBack: () => void }) {
  const { state, dispatch } = useStore()
  const [creating, setCreating] = useState(false)
  const subtasks = state.tasks.filter((t) => t.projectId === project.id)
  const done = subtasks.filter((t) => t.status === 'done').length
  const pct = subtasks.length > 0 ? Math.round((done / subtasks.length) * 100) : 0

  return (
    <div className="space-y-3">
      <button onClick={onBack} className="text-sm text-[#9fb2bf] hover:text-white">← Назад к ивентам</button>
      <div className="pixel-panel p-3">
        <div className="text-xs text-[#facc15] font-bold mb-1">ИВЕНТ</div>
        <div className="text-lg font-bold text-[#eef3f6]">{project.title}</div>
        {project.description && <div className="text-xs text-[#9fb2bf] mt-1">{project.description}</div>}
        <div className="text-xs text-[#9fb2bf] mt-1">
          {new Date(project.startDate).toLocaleDateString('ru-RU')} — {new Date(project.endDate).toLocaleDateString('ru-RU')}
        </div>
        <div className="h-3 pixel-slot overflow-hidden mt-2">
          <div className="h-full bg-[#facc15]" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-xs text-[#9fb2bf] mt-1">{pct}% · Участники: {project.participants.map((p) => (p === 'arai' ? 'Арай' : 'Линара')).join(', ')}</div>
        {project.completed && <div className="text-xs text-[#4ade80] font-semibold mt-1">Ивент завершён — награды получены</div>}
      </div>
      <div className="space-y-2">
        {subtasks.map((t) => (
          <TaskCard key={t.id} task={t} onDelete={() => dispatch({ type: 'DELETE_TASK', id: t.id })} />
        ))}
        {subtasks.length === 0 && <div className="text-sm text-[#9fb2bf]">Заданий в ивенте пока нет</div>}
      </div>
      <button onClick={() => setCreating(true)} className="pixel-btn bg-[#243544] text-[#eef3f6] text-sm px-3 py-2">Добавить задание в ивент</button>
      {creating && <TaskForm projectId={project.id} onClose={() => setCreating(false)} />}
    </div>
  )
}

export function BoardContent({ compact }: { compact?: boolean }) {
  const { state, dispatch } = useStore()
  const me = state.currentPlayer as PlayerId
  const [tab, setTab] = useState<'tasks' | 'events'>('tasks')
  const [filter, setFilter] = useState<Filter>('mine')
  const [creating, setCreating] = useState(false)
  const [openProjectId, setOpenProjectId] = useState<string | null>(null)
  const [pTitle, setPTitle] = useState('')
  const [pEnd, setPEnd] = useState('')

  const topLevelTasks = state.tasks.filter((t) => !t.projectId)
  const arai = summaryFor(topLevelTasks, 'arai')
  const linara = summaryFor(topLevelTasks, 'linara')
  const overallDone = topLevelTasks.filter((t) => t.status === 'done').length
  const overallPct = topLevelTasks.length > 0 ? Math.round((overallDone / topLevelTasks.length) * 100) : 0

  const tasks = useMemo(() => {
    return topLevelTasks
      .filter((t) => {
        switch (filter) {
          case 'mine': return t.assignee === me || t.assignee === 'both'
          case 'arai': return t.assignee === 'arai'
          case 'linara': return t.assignee === 'linara'
          case 'both': return t.assignee === 'both'
          case 'active': return t.status !== 'done'
          case 'done': return t.status === 'done'
          case 'overdue': return t.status !== 'done' && !!t.deadline && new Date(t.deadline).getTime() < Date.now()
          case 'urgent': return t.urgent && t.status !== 'done'
          default: return true
        }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [topLevelTasks, filter, me])

  const openProject = state.projects.find((p) => p.id === openProjectId)

  return (
    <div>
      {!compact && (
        <div className="flex gap-1 mb-3">
          <button onClick={() => setTab('tasks')} className={`pixel-btn text-sm px-3 py-1.5 ${tab === 'tasks' ? 'bg-[#31485a] text-white' : 'bg-[#243544] text-[#9fb2bf]'}`}>Задания</button>
          <button onClick={() => setTab('events')} className={`pixel-btn text-sm px-3 py-1.5 ${tab === 'events' ? 'bg-[#31485a] text-white' : 'bg-[#243544] text-[#9fb2bf]'}`}>Проекты-ивенты</button>
        </div>
      )}

      {tab === 'tasks' && (
        <>
          {!compact && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="pixel-panel p-2 text-xs text-[#9fb2bf]">
                <div className="text-[#eef3f6] font-semibold mb-1">Арай</div>
                <div>{arai.inProgress} в работе · {arai.fresh} новых · {arai.review} на проверке</div>
              </div>
              <div className="pixel-panel p-2 text-xs text-[#9fb2bf]">
                <div className="text-[#eef3f6] font-semibold mb-1">Линара</div>
                <div>{linara.inProgress} в работе · {linara.fresh} новых · {linara.review} на проверке</div>
              </div>
              <div className="pixel-panel p-2 text-xs text-[#9fb2bf]">
                <div className="text-[#eef3f6] font-semibold mb-1">Общий прогресс</div>
                <div className="h-2 pixel-slot overflow-hidden mb-1"><div className="h-full bg-[#4ade80]" style={{ width: `${overallPct}%` }} /></div>
                <div>{overallPct}%</div>
              </div>
            </div>
          )}

          <div className="flex gap-1 mb-3 flex-wrap">
            {(compact ? FILTERS.filter((f) => ['mine', 'all', 'active', 'done', 'urgent'].includes(f.id)) : FILTERS).map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)} className={`pixel-btn text-xs px-2.5 py-1.5 ${filter === f.id ? 'bg-[#31485a] text-white' : 'bg-[#243544] text-[#9fb2bf]'}`}>
                {f.label}
              </button>
            ))}
          </div>

          <button onClick={() => setCreating(true)} className="pixel-btn bg-[#ffcb47] text-[#12181f] font-bold text-sm px-3 py-2 mb-3 w-full">+ Создать задание</button>
          <div className={`space-y-2 ${compact ? 'max-h-[52vh] overflow-y-auto pr-1' : ''}`}>
            {tasks.map((t) => (
              <TaskCard key={t.id} task={t} onDelete={() => dispatch({ type: 'DELETE_TASK', id: t.id })} />
            ))}
            {tasks.length === 0 && <div className="text-sm text-[#9fb2bf]">Заданий пока нет</div>}
          </div>
        </>
      )}

      {!compact && tab === 'events' && !openProject && (
        <div className="space-y-3">
          <div className="pixel-panel p-3 space-y-2">
            <input value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="Название ивента" className="w-full pixel-slot px-3 py-2 outline-none text-[#eef3f6]" />
            <div className="flex gap-2 items-center">
              <label className="text-xs text-[#9fb2bf]">Окончание</label>
              <input type="date" value={pEnd} onChange={(e) => setPEnd(e.target.value)} className="pixel-slot px-2 py-1.5 outline-none text-[#eef3f6] text-sm" />
              <button
                onClick={() => {
                  if (!pTitle.trim() || !pEnd) return
                  const project: Omit<Project, 'rewardItemIds' | 'completed'> = {
                    id: uid('proj'),
                    title: pTitle.trim(),
                    startDate: new Date().toISOString(),
                    endDate: new Date(pEnd).toISOString(),
                    participants: ['arai', 'linara'],
                    createdAt: new Date().toISOString(),
                  }
                  dispatch({ type: 'ADD_PROJECT', project })
                  setPTitle('')
                  setPEnd('')
                }}
                className="pixel-btn bg-[#2fae7a] text-white text-sm px-3 py-2 ml-auto"
              >
                Создать ивент
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {state.projects.map((p) => {
              const subtasks = state.tasks.filter((t) => t.projectId === p.id)
              const done = subtasks.filter((t) => t.status === 'done').length
              const pct = subtasks.length > 0 ? Math.round((done / subtasks.length) * 100) : 0
              return (
                <button key={p.id} onClick={() => setOpenProjectId(p.id)} className="pixel-panel w-full text-left p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#eef3f6]">{p.title}{p.completed ? ' ✅' : ''}</span>
                    <span className="text-sm text-[#9fb2bf]">{pct}%</span>
                  </div>
                  <div className="h-2 pixel-slot overflow-hidden"><div className="h-full bg-[#facc15]" style={{ width: `${pct}%` }} /></div>
                </button>
              )
            })}
            {state.projects.length === 0 && <div className="text-sm text-[#9fb2bf]">Проектов-ивентов пока нет</div>}
          </div>
        </div>
      )}

      {!compact && tab === 'events' && openProject && <ProjectView project={openProject} onBack={() => setOpenProjectId(null)} />}

      {creating && <TaskForm onClose={() => setCreating(false)} />}
    </div>
  )
}

export function BoardModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Общая доска" onClose={onClose} wide>
      <BoardContent />
    </ModalShell>
  )
}
