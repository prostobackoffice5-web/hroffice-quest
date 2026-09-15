import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2 } from 'lucide-react'
import type { Assignee, Difficulty, Priority, Quest, QuestType, Subtask, TimeChallengeMode } from '../types'
import { useStore } from '../store'
import { DIFFICULTY_REWARDS, PRIORITY_META, TIME_CHALLENGE_MODES } from '../data/engine'
import { uid } from '../utils'

interface Props {
  quest: Quest | null
  onClose: () => void
  defaultProjectId?: string
}

const TYPE_LABEL: Record<QuestType, string> = {
  daily: 'Daily Quest',
  weekly: 'Weekly Quest',
  onetime: 'One-time Quest',
  project: 'Project Quest',
}

function emptyQuest(defaultProjectId?: string): Quest {
  return {
    id: uid('q'),
    title: '',
    description: '',
    type: defaultProjectId ? 'project' : 'onetime',
    categoryId: 'other',
    priority: 'medium',
    difficulty: 'normal',
    assignee: 'arai',
    status: 'todo',
    xp: DIFFICULTY_REWARDS.normal.xp,
    coins: DIFFICULTY_REWARDS.normal.coins,
    subtasks: [],
    createdAt: new Date().toISOString(),
    projectId: defaultProjectId,
  }
}

export function QuestModal({ quest, onClose, defaultProjectId }: Props) {
  const { state, dispatch } = useStore()
  const [draft, setDraft] = useState<Quest>(quest ?? emptyQuest(defaultProjectId))
  const [subtaskInput, setSubtaskInput] = useState('')

  useEffect(() => {
    setDraft(quest ?? emptyQuest(defaultProjectId))
  }, [quest, defaultProjectId])

  const applyDifficulty = (difficulty: Difficulty) => {
    const r = DIFFICULTY_REWARDS[difficulty]
    setDraft((d) => ({ ...d, difficulty, xp: r.xp, coins: r.coins }))
  }

  const addSubtask = () => {
    if (!subtaskInput.trim()) return
    const s: Subtask = { id: uid('s'), title: subtaskInput.trim(), done: false }
    setDraft((d) => ({ ...d, subtasks: [...d.subtasks, s] }))
    setSubtaskInput('')
  }

  const save = () => {
    if (!draft.title.trim()) return
    if (quest) {
      dispatch({ type: 'UPDATE_QUEST', quest: draft })
    } else {
      dispatch({ type: 'ADD_QUEST', quest: draft })
    }
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="pixel-border bg-[#241a40] w-full max-w-lg max-h-[90vh] overflow-y-auto p-5"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">{quest ? 'Редактировать квест' : 'CREATE QUEST'}</h2>
            <button onClick={onClose} className="text-purple-300 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="Название квеста"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-purple-300/50 outline-none focus:border-fuchsia-400"
            />
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="Описание (необязательно)"
              rows={2}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-purple-300/50 outline-none focus:border-fuchsia-400"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-purple-300">Тип</label>
                <select
                  value={draft.type}
                  onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as QuestType }))}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-white outline-none"
                >
                  {Object.entries(TYPE_LABEL).map(([k, v]) => (
                    <option key={k} value={k} className="bg-[#241a40]">{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-purple-300">Категория</label>
                <select
                  value={draft.categoryId}
                  onChange={(e) => setDraft((d) => ({ ...d, categoryId: e.target.value }))}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-white outline-none"
                >
                  {state.categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#241a40]">{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-purple-300">Приоритет</label>
                <select
                  value={draft.priority}
                  onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value as Priority }))}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-white outline-none"
                >
                  {Object.entries(PRIORITY_META).map(([k, v]) => (
                    <option key={k} value={k} className="bg-[#241a40]">{v.icon} {v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-purple-300">Сложность</label>
                <select
                  value={draft.difficulty}
                  onChange={(e) => applyDifficulty(e.target.value as Difficulty)}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-white outline-none"
                >
                  {Object.entries(DIFFICULTY_REWARDS).map(([k, v]) => (
                    <option key={k} value={k} className="bg-[#241a40]">{v.stars} {v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-purple-300">XP</label>
                <input
                  type="number"
                  value={draft.xp}
                  onChange={(e) => setDraft((d) => ({ ...d, xp: Number(e.target.value) }))}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-purple-300">Coins</label>
                <input
                  type="number"
                  value={draft.coins}
                  onChange={(e) => setDraft((d) => ({ ...d, coins: Number(e.target.value) }))}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-purple-300">Дедлайн</label>
                <input
                  type="date"
                  value={draft.deadline ? draft.deadline.slice(0, 10) : ''}
                  onChange={(e) => setDraft((d) => ({ ...d, deadline: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-purple-300">Назначить</label>
                <select
                  value={draft.assignee}
                  onChange={(e) => setDraft((d) => ({ ...d, assignee: e.target.value as Assignee }))}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-white outline-none"
                >
                  <option value="arai" className="bg-[#241a40]">👑 Арай</option>
                  <option value="linara" className="bg-[#241a40]">🌱 Линара</option>
                  <option value="both" className="bg-[#241a40]">🤝 Вместе</option>
                </select>
              </div>
            </div>

            {state.projects.length > 0 && (
              <div>
                <label className="text-xs text-purple-300">Проект (необязательно)</label>
                <select
                  value={draft.projectId ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, projectId: e.target.value || undefined }))}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-white outline-none"
                >
                  <option value="" className="bg-[#241a40]">— без проекта —</option>
                  {state.projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#241a40]">{p.icon} {p.title}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="pixel-border bg-white/5 p-3">
              <label className="flex items-center gap-2 text-sm text-white font-semibold">
                <input
                  type="checkbox"
                  checked={!!draft.timeChallenge?.enabled}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      timeChallenge: e.target.checked
                        ? { enabled: true, mode: 'standard', durationMinutes: TIME_CHALLENGE_MODES.standard.minutes }
                        : undefined,
                    }))
                  }
                />
                ⚡ Time Challenge
              </label>
              {draft.timeChallenge?.enabled && (
                <div className="mt-2">
                  <label className="text-xs text-purple-300">Режим</label>
                  <select
                    value={draft.timeChallenge.mode}
                    onChange={(e) => {
                      const mode = e.target.value as TimeChallengeMode
                      setDraft((d) => ({ ...d, timeChallenge: { enabled: true, mode, durationMinutes: TIME_CHALLENGE_MODES[mode].minutes } }))
                    }}
                    className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-white outline-none"
                  >
                    {Object.entries(TIME_CHALLENGE_MODES).map(([k, v]) => (
                      <option key={k} value={k} className="bg-[#241a40]">
                        {v.label} · {v.minutes} мин · x{v.bonusMult} награда
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-purple-300">Подзадачи (checklist)</label>
              <div className="space-y-1.5 mt-1">
                {draft.subtasks.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <span className="text-sm text-purple-100 flex-1">{s.title}</span>
                    <button
                      onClick={() => setDraft((d) => ({ ...d, subtasks: d.subtasks.filter((x) => x.id !== s.id) }))}
                      className="text-purple-300 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                    placeholder="Добавить подзадачу"
                    className="flex-1 rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white placeholder:text-purple-300/50 outline-none"
                  />
                  <button onClick={addSubtask} className="rounded-lg bg-white/10 hover:bg-white/20 px-2 text-purple-100">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-purple-200 hover:bg-white/10">Отмена</button>
            <button onClick={save} className="rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 px-4 py-2 text-sm font-semibold text-white">
              {quest ? 'Сохранить' : 'Создать квест'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
