import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { PRIORITY_LABELS, DIFFICULTY_LABELS } from '../data/categories'
import { FocusControls } from './FocusControls'
import type { PlayerId, Task } from '../types'

const PLAYER_LABEL: Record<string, string> = { arai: 'Арай', linara: 'Линара', both: 'Вместе' }
const STATUS_LABEL: Record<Task['status'], { label: string; color: string }> = {
  new: { label: 'Новое', color: '#9ca3af' },
  in_progress: { label: 'В работе', color: '#38bdf8' },
  review: { label: 'На проверке', color: '#facc15' },
  done: { label: 'Выполнено', color: '#4ade80' },
}
const PROGRESS_STEPS = [0, 25, 50, 75, 100]

function useNow(active: boolean) {
  const [, force] = useState(0)
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => force((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [active])
}

function UrgentTimer({ task }: { task: Task }) {
  useNow(task.urgent && task.status !== 'done')
  if (!task.urgent || !task.urgentDeadline || task.status === 'done') return null
  const remaining = new Date(task.urgentDeadline).getTime() - Date.now()
  if (remaining <= 0) return <div className="text-xs text-[#f87171] font-semibold">Срок срочности истёк</div>
  const h = Math.floor(remaining / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  return <div className="text-xs text-[#facc15] font-semibold">⚡ Срочно: осталось {h} ч {m} мин</div>
}

export function TaskCard({ task, onDelete }: { task: Task; onDelete?: () => void }) {
  const { state, dispatch } = useStore()
  const me = state.currentPlayer as PlayerId
  const category = state.categories.find((c) => c.id === task.categoryId)
  const priority = PRIORITY_LABELS[task.priority]
  const done = task.status === 'done'
  const overdue = !done && task.deadline && new Date(task.deadline).getTime() < Date.now()
  const [composing, setComposing] = useState(false)
  const [text, setText] = useState('')

  const isMine = task.assignee === me || task.assignee === 'both'
  const myJointDone = task.assignee === 'both' && (task.jointProgress?.[me] ?? 0) >= 100

  const setProgress = (value: number) => {
    dispatch({ type: 'SET_TASK_PROGRESS', id: task.id, player: me, progress: value })
    if (value > 0 && task.status === 'new') dispatch({ type: 'SET_TASK_STATUS', id: task.id, status: 'in_progress' })
    if (value >= 100 && task.status !== 'done') dispatch({ type: 'SET_TASK_STATUS', id: task.id, status: 'review' })
  }

  const complete = () => dispatch({ type: 'COMPLETE_TASK', id: task.id, player: me })

  const otherPlayer: PlayerId = me === 'arai' ? 'linara' : 'arai'

  return (
    <div className="pixel-panel p-3 flex flex-col gap-1.5" style={{ borderLeft: `4px solid ${category?.color ?? '#8b9dc3'}` }}>
      <div className="flex items-start justify-between gap-2">
        <div className={`font-semibold text-[#f3e9d2] ${done ? 'line-through opacity-60' : ''}`}>{task.title}</div>
        <div className="text-xs text-[#facc15] whitespace-nowrap">
          +{task.xp} опыта · +{task.coins} монет{task.urgent ? ` · бонус +${task.bonusSparks ?? 0} искр` : ''}
        </div>
      </div>
      {task.description && <div className="text-xs text-[#d8c9a8]">{task.description}</div>}
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#d8c9a8]">
        <span>{category?.name}</span>
        <span style={{ color: priority.color }}>● {priority.label}</span>
        <span>{DIFFICULTY_LABELS[task.difficulty]}</span>
        <span>{PLAYER_LABEL[task.assignee]}</span>
        <span style={{ color: STATUS_LABEL[task.status].color }}>{STATUS_LABEL[task.status].label}</span>
        {overdue && <span className="text-[#f87171] font-semibold">Просрочено</span>}
        {task.deadline && <span>до {new Date(task.deadline).toLocaleDateString('ru-RU')}</span>}
      </div>

      <UrgentTimer task={task} />
      {!done && <FocusControls task={task} />}

      {task.assignee === 'both' ? (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#d8c9a8]">
            <span className="w-14">Арай</span>
            <div className="flex-1 h-2 pixel-slot overflow-hidden"><div className="h-full bg-[#38bdf8]" style={{ width: `${task.jointProgress?.arai ?? 0}%` }} /></div>
            <span className="w-8 text-right">{task.jointProgress?.arai ?? 0}%</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#d8c9a8]">
            <span className="w-14">Линара</span>
            <div className="flex-1 h-2 pixel-slot overflow-hidden"><div className="h-full bg-[#f472b6]" style={{ width: `${task.jointProgress?.linara ?? 0}%` }} /></div>
            <span className="w-8 text-right">{task.jointProgress?.linara ?? 0}%</span>
          </div>
        </div>
      ) : (
        !done && (
          <div className="flex items-center gap-2 text-xs text-[#d8c9a8]">
            <div className="flex-1 h-2 pixel-slot overflow-hidden"><div className="h-full bg-[#4ade80]" style={{ width: `${task.progress}%` }} /></div>
            <span className="w-8 text-right">{task.progress}%</span>
          </div>
        )
      )}

      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
        {!done && isMine && (task.assignee !== 'both' || !myJointDone) && (
          <div className="flex gap-1">
            {PROGRESS_STEPS.map((p) => (
              <button key={p} onClick={() => setProgress(p)} className="pixel-btn bg-[#4a3826] text-[#f3e9d2] text-[10px] px-1.5 py-1">
                {p}%
              </button>
            ))}
          </div>
        )}
        {!done && isMine && (task.assignee !== 'both' ? task.progress >= 100 : myJointDone) && (
          <button onClick={complete} className="pixel-btn bg-[#3f7d3a] text-white text-xs px-3 py-1.5">Завершить</button>
        )}
        <button onClick={() => setComposing((c) => !c)} className="pixel-btn bg-[#4a3826] text-[#f3e9d2] text-xs px-3 py-1.5">💬 Написать</button>
        {onDelete && (
          <button onClick={onDelete} className="pixel-btn bg-[#8b3a3a] text-white text-xs px-3 py-1.5">Удалить</button>
        )}
      </div>

      {composing && (
        <div className="flex gap-2 mt-1">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Сообщение" className="flex-1 pixel-slot px-2 py-1.5 text-xs text-[#f3e9d2] outline-none" />
          <button
            onClick={() => {
              if (!text.trim()) return
              dispatch({ type: 'SEND_MESSAGE', from: me, to: otherPlayer, text: text.trim(), taskId: task.id })
              setText('')
              setComposing(false)
            }}
            className="pixel-btn bg-[#3f7d3a] text-white text-xs px-3 py-1.5"
          >
            Отправить
          </button>
        </div>
      )}
    </div>
  )
}
