import { useState } from 'react'
import { ModalShell } from './ModalShell'
import { useStore } from '../store'
import { DEFAULT_CATEGORIES, PRIORITY_LABELS, DIFFICULTY_LABELS } from '../data/categories'
import type { Difficulty, PlayerId, Priority, Task } from '../types'
import { uid } from '../utils'

export function TaskForm({ onClose, projectId }: { onClose: () => void; projectId?: string }) {
  const { state, dispatch } = useStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORIES[0].id)
  const [priority, setPriority] = useState<Priority>('medium')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [assignee, setAssignee] = useState<PlayerId>(state.currentPlayer ?? 'arai')
  const [deadline, setDeadline] = useState('')
  const [xp, setXp] = useState(10)
  const [coins, setCoins] = useState(5)

  const save = () => {
    if (!title.trim()) return
    const task: Task = {
      id: uid('task'),
      title: title.trim(),
      description: description.trim() || undefined,
      categoryId,
      priority,
      difficulty,
      assignee,
      status: 'active',
      xp: Math.max(0, xp),
      coins: Math.max(0, coins),
      deadline: deadline || undefined,
      projectId,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_TASK', task })
    onClose()
  }

  return (
    <ModalShell title={projectId ? 'Создать подзадачу' : 'Создать задание'} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-[#d8c9a8] block mb-1">Название</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full pixel-slot px-3 py-2 outline-none text-[#f3e9d2]" />
        </div>
        <div>
          <label className="text-xs text-[#d8c9a8] block mb-1">Описание</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full pixel-slot px-3 py-2 outline-none text-[#f3e9d2]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#d8c9a8] block mb-1">Категория</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full pixel-slot px-2 py-2 outline-none text-[#f3e9d2]">
              {state.categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#2b2016]">{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#d8c9a8] block mb-1">Приоритет</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full pixel-slot px-2 py-2 outline-none text-[#f3e9d2]">
              {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                <option key={k} value={k} className="bg-[#2b2016]">{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#d8c9a8] block mb-1">Сложность</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="w-full pixel-slot px-2 py-2 outline-none text-[#f3e9d2]">
              {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
                <option key={k} value={k} className="bg-[#2b2016]">{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#d8c9a8] block mb-1">Дедлайн</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full pixel-slot px-2 py-2 outline-none text-[#f3e9d2]" />
          </div>
          <div>
            <label className="text-xs text-[#d8c9a8] block mb-1">Исполнитель</label>
            <select value={assignee} onChange={(e) => setAssignee(e.target.value as PlayerId)} className="w-full pixel-slot px-2 py-2 outline-none text-[#f3e9d2]">
              <option value="arai" className="bg-[#2b2016]">Арай</option>
              <option value="linara" className="bg-[#2b2016]">Линара</option>
            </select>
          </div>
          <div />
          <div>
            <label className="text-xs text-[#d8c9a8] block mb-1">Опыт</label>
            <input type="number" min={0} value={xp} onChange={(e) => setXp(Number(e.target.value))} className="w-full pixel-slot px-2 py-2 outline-none text-[#f3e9d2]" />
          </div>
          <div>
            <label className="text-xs text-[#d8c9a8] block mb-1">Монеты</label>
            <input type="number" min={0} value={coins} onChange={(e) => setCoins(Number(e.target.value))} className="w-full pixel-slot px-2 py-2 outline-none text-[#f3e9d2]" />
          </div>
        </div>
        <button onClick={save} className="pixel-btn w-full py-2.5 bg-[#3f7d3a] text-white mt-2">Сохранить</button>
      </div>
    </ModalShell>
  )
}
