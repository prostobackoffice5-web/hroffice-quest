import { useStore } from '../store'
import { PRIORITY_LABELS, DIFFICULTY_LABELS } from '../data/categories'
import type { Task } from '../types'

const PLAYER_LABEL: Record<string, string> = { arai: 'Арай', linara: 'Линара' }

export function TaskCard({ task, onDelete }: { task: Task; onDelete?: () => void }) {
  const { state, dispatch } = useStore()
  const category = state.categories.find((c) => c.id === task.categoryId)
  const priority = PRIORITY_LABELS[task.priority]
  const done = task.status === 'done'

  return (
    <div className="pixel-panel p-3 flex flex-col gap-1.5" style={{ borderLeft: `4px solid ${category?.color ?? '#8b9dc3'}` }}>
      <div className="flex items-start justify-between gap-2">
        <div className={`font-semibold text-[#f3e9d2] ${done ? 'line-through opacity-60' : ''}`}>{task.title}</div>
        <div className="text-xs text-[#facc15] whitespace-nowrap">+{task.xp} опыта · +{task.coins} монет</div>
      </div>
      {task.description && <div className="text-xs text-[#d8c9a8]">{task.description}</div>}
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#d8c9a8]">
        <span>{category?.name}</span>
        <span style={{ color: priority.color }}>● {priority.label}</span>
        <span>{DIFFICULTY_LABELS[task.difficulty]}</span>
        <span>{PLAYER_LABEL[task.assignee]}</span>
        {task.deadline && <span>до {new Date(task.deadline).toLocaleDateString('ru-RU')}</span>}
      </div>
      <div className="flex items-center gap-2 mt-1">
        {!done && (
          <button
            onClick={() => dispatch({ type: 'COMPLETE_TASK', id: task.id })}
            className="pixel-btn bg-[#3f7d3a] text-white text-xs px-3 py-1.5"
          >
            Завершить
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="pixel-btn bg-[#8b3a3a] text-white text-xs px-3 py-1.5">
            Удалить
          </button>
        )}
      </div>
    </div>
  )
}
