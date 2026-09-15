import { useState } from 'react'
import { ModalShell } from './ModalShell'
import { useStore } from '../store'
import { DEFAULT_CATEGORIES, PRIORITY_LABELS, DIFFICULTY_LABELS } from '../data/categories'
import type { Assignee, Difficulty, Priority, Task } from '../types'
import { uid } from '../utils'

export function TaskForm({ onClose, projectId }: { onClose: () => void; projectId?: string }) {
  const { state, dispatch } = useStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORIES[0].id)
  const [priority, setPriority] = useState<Priority>('medium')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [assignee, setAssignee] = useState<Assignee>(state.currentPlayer ?? 'arai')
  const [deadline, setDeadline] = useState('')
  const [xp, setXp] = useState(10)
  const [coins, setCoins] = useState(5)
  const [urgent, setUrgent] = useState(false)
  const [urgentDeadline, setUrgentDeadline] = useState('')
  const [bonusXp, setBonusXp] = useState(20)
  const [bonusCoins, setBonusCoins] = useState(20)
  const [bonusSparks, setBonusSparks] = useState(10)

  const save = () => {
    if (!title.trim()) return
    if (urgent && !urgentDeadline) return
    const task: Task = {
      id: uid('task'),
      title: title.trim(),
      description: description.trim() || undefined,
      categoryId,
      priority,
      difficulty,
      assignee,
      status: 'new',
      progress: 0,
      jointProgress: assignee === 'both' ? { arai: 0, linara: 0 } : undefined,
      xp: Math.max(0, xp),
      coins: Math.max(0, coins),
      urgent,
      urgentDeadline: urgent ? new Date(urgentDeadline).toISOString() : undefined,
      bonusXp: urgent ? Math.max(0, bonusXp) : undefined,
      bonusCoins: urgent ? Math.max(0, bonusCoins) : undefined,
      bonusSparks: urgent ? Math.max(0, bonusSparks) : undefined,
      deadline: deadline || undefined,
      projectId,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_TASK', task })
    onClose()
  }

  return (
    <ModalShell title={projectId ? 'Создать подзадачу' : 'Создать задание'} onClose={onClose} wide>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-[#9fb2bf] block mb-1">Название</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full pixel-slot px-3 py-2 outline-none text-[#eef3f6]" />
        </div>
        <div>
          <label className="text-xs text-[#9fb2bf] block mb-1">Описание</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full pixel-slot px-3 py-2 outline-none text-[#eef3f6]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1">Категория</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full pixel-slot px-2 py-2 outline-none text-[#eef3f6]">
              {state.categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#141d26]">{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1">Приоритет</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full pixel-slot px-2 py-2 outline-none text-[#eef3f6]">
              {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                <option key={k} value={k} className="bg-[#141d26]">{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1">Сложность</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="w-full pixel-slot px-2 py-2 outline-none text-[#eef3f6]">
              {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
                <option key={k} value={k} className="bg-[#141d26]">{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1">Дедлайн</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full pixel-slot px-2 py-2 outline-none text-[#eef3f6]" />
          </div>
          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1">Исполнитель</label>
            <select value={assignee} onChange={(e) => setAssignee(e.target.value as Assignee)} className="w-full pixel-slot px-2 py-2 outline-none text-[#eef3f6]">
              <option value="arai" className="bg-[#141d26]">Арай</option>
              <option value="linara" className="bg-[#141d26]">Линара</option>
              <option value="both" className="bg-[#141d26]">Вместе</option>
            </select>
          </div>
          <div />
          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1">Опыт</label>
            <input type="number" min={0} value={xp} onChange={(e) => setXp(Number(e.target.value))} className="w-full pixel-slot px-2 py-2 outline-none text-[#eef3f6]" />
          </div>
          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1">Монеты</label>
            <input type="number" min={0} value={coins} onChange={(e) => setCoins(Number(e.target.value))} className="w-full pixel-slot px-2 py-2 outline-none text-[#eef3f6]" />
          </div>
        </div>

        <div className="pixel-panel p-3">
          <label className="flex items-center gap-2 text-sm text-[#eef3f6] font-semibold">
            <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />
            Срочное задание
          </label>
          {urgent && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="col-span-2">
                <label className="text-xs text-[#9fb2bf] block mb-1">Срок (дата и время)</label>
                <input type="datetime-local" value={urgentDeadline} onChange={(e) => setUrgentDeadline(e.target.value)} className="w-full pixel-slot px-2 py-2 outline-none text-[#eef3f6]" />
              </div>
              <div>
                <label className="text-xs text-[#9fb2bf] block mb-1">Бонус опыта</label>
                <input type="number" min={0} value={bonusXp} onChange={(e) => setBonusXp(Number(e.target.value))} className="w-full pixel-slot px-2 py-2 outline-none text-[#eef3f6]" />
              </div>
              <div>
                <label className="text-xs text-[#9fb2bf] block mb-1">Бонус монет</label>
                <input type="number" min={0} value={bonusCoins} onChange={(e) => setBonusCoins(Number(e.target.value))} className="w-full pixel-slot px-2 py-2 outline-none text-[#eef3f6]" />
              </div>
              <div>
                <label className="text-xs text-[#9fb2bf] block mb-1">Бонус искр</label>
                <input type="number" min={0} value={bonusSparks} onChange={(e) => setBonusSparks(Number(e.target.value))} className="w-full pixel-slot px-2 py-2 outline-none text-[#eef3f6]" />
              </div>
            </div>
          )}
        </div>

        <button onClick={save} className="pixel-btn w-full py-2.5 bg-[#2fae7a] text-white mt-2">Сохранить</button>
      </div>
    </ModalShell>
  )
}
