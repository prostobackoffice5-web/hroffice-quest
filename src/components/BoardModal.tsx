import { useState } from 'react'
import { ModalShell } from './ModalShell'
import { TaskForm } from './TaskForm'
import { TaskCard } from './TaskCard'
import { useStore } from '../store'

export function BoardModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore()
  const [creating, setCreating] = useState(false)
  const tasks = [...state.tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <ModalShell title="Доска заданий" onClose={onClose} wide>
      <button onClick={() => setCreating(true)} className="pixel-btn bg-[#4a3826] text-[#f3e9d2] text-sm px-3 py-2 mb-3">
        Создать первое задание
      </button>
      <div className="space-y-2">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onDelete={() => dispatch({ type: 'DELETE_TASK', id: t.id })} />
        ))}
        {tasks.length === 0 && <div className="text-sm text-[#d8c9a8]">Заданий пока нет</div>}
      </div>
      {creating && <TaskForm onClose={() => setCreating(false)} />}
    </ModalShell>
  )
}
