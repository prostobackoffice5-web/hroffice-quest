import { motion } from 'framer-motion'
import { Check, RotateCcw, Trash2, Pencil, Zap } from 'lucide-react'
import type { Quest } from '../types'
import { useStore } from '../store'
import { DIFFICULTY_REWARDS, PRIORITY_META, TIME_CHALLENGE_MODES } from '../data/engine'
import { deadlineStatus, formatDeadline } from '../utils'
import { DEFAULT_CATEGORIES } from '../data/categories'
import { TimeChallengeTimer } from './TimeChallengeTimer'

const ASSIGNEE_LABEL: Record<Quest['assignee'], string> = {
  arai: '👑 Арай',
  linara: '🌱 Линара',
  both: '🤝 Вместе',
}

export function QuestCard({ quest, onEdit }: { quest: Quest; onEdit: (q: Quest) => void }) {
  const { state, dispatch } = useStore()
  const category = state.categories.find((c) => c.id === quest.categoryId) ?? DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
  const priority = PRIORITY_META[quest.priority]
  const difficulty = DIFFICULTY_REWARDS[quest.difficulty]
  const dStatus = deadlineStatus(quest.deadline)
  const done = quest.status === 'done'
  const subDone = quest.subtasks.filter((s) => s.done).length

  const canComplete = () => {
    if (done) return false
    if (quest.assignee === 'both') return !(quest.completedByBoth ?? []).includes(state.currentPlayer)
    return quest.assignee === state.currentPlayer
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`pixel-border p-3.5 bg-[#241a40] border-l-4 ${done ? 'opacity-60' : ''} ${quest.difficulty === 'boss' ? 'ring-1 ring-red-400/40' : ''}`}
      style={{ borderLeftColor: category.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-lg leading-none">{category.icon}</span>
          <div className="min-w-0">
            <div className={`text-white font-medium truncate ${done ? 'line-through' : ''}`}>
              {quest.difficulty === 'boss' && '👾 '}{quest.title}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-purple-200/70">
              <span>{priority.icon} {priority.label}</span>
              <span>{difficulty.stars}</span>
              <span>{ASSIGNEE_LABEL[quest.assignee]}</span>
              {quest.deadline && (
                <span className={dStatus === 'overdue' ? 'text-red-400' : dStatus === 'today' ? 'text-amber-300' : ''}>
                  {dStatus === 'overdue' ? '🔴 Overdue' : dStatus === 'today' ? '⏰ Сегодня' : `📅 ${formatDeadline(quest.deadline)}`}
                </span>
              )}
              {quest.subtasks.length > 0 && <span>✅ {subDone}/{quest.subtasks.length}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs text-amber-300 whitespace-nowrap">+{quest.xp}XP / +{quest.coins}🪙</span>
        </div>
      </div>

      {quest.subtasks.length > 0 && (
        <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-emerald-400"
            style={{ width: `${(subDone / quest.subtasks.length) * 100}%` }}
          />
        </div>
      )}

      <TimeChallengeTimer quest={quest} />

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {!done && canComplete() && quest.timeChallenge?.enabled && !quest.timeChallenge.startedAt && (
          <button
            onClick={() =>
              dispatch({
                type: 'START_TIME_CHALLENGE',
                questId: quest.id,
                mode: quest.timeChallenge!.mode,
                minutes: TIME_CHALLENGE_MODES[quest.timeChallenge!.mode].minutes,
              })
            }
            className="flex items-center gap-1 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-[#241a40] text-xs font-bold px-3 py-1.5 transition"
          >
            <Zap size={14} /> START CHALLENGE
          </button>
        )}
        {!done && canComplete() && (
          <button
            onClick={() => dispatch({ type: 'COMPLETE_QUEST', id: quest.id, by: state.currentPlayer })}
            className="flex items-center gap-1 rounded-lg bg-emerald-500/90 hover:bg-emerald-400 text-white text-xs font-semibold px-3 py-1.5 transition"
          >
            <Check size={14} /> COMPLETE
          </button>
        )}
        {done && (
          <button
            onClick={() => dispatch({ type: 'REOPEN_QUEST', id: quest.id })}
            className="flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 text-purple-100 text-xs px-3 py-1.5 transition"
          >
            <RotateCcw size={14} /> Вернуть
          </button>
        )}
        <button
          onClick={() => onEdit(quest)}
          className="flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 text-purple-100 text-xs px-3 py-1.5 transition"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => dispatch({ type: 'DELETE_QUEST', id: quest.id })}
          className="flex items-center gap-1 rounded-lg bg-white/10 hover:bg-red-500/40 text-purple-100 text-xs px-3 py-1.5 transition"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}
