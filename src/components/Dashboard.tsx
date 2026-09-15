import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { CharacterPanel } from './CharacterPanel'
import { QuestCard } from './QuestCard'
import { QuestModal } from './QuestModal'
import type { Quest } from '../types'
import { SEASON_TRACK, SEASON_XP_PER_LEVEL } from '../data/gamedata'
import { todayKey } from '../data/engine'

function EventsBanner() {
  const { state } = useStore()
  const active = state.activeEvents.filter((e) => new Date(e.expiresAt).getTime() > Date.now())
  if (active.length === 0) return null
  return (
    <div className="space-y-2">
      {active.map((e) => (
        <div key={e.id} className="pixel-border bg-linear-to-r from-amber-500/20 to-fuchsia-500/20 border border-amber-400/30 p-3 flex items-center gap-3">
          <div className="text-2xl">{e.icon}</div>
          <div>
            <div className="text-white font-semibold text-sm">{e.title}</div>
            <div className="text-xs text-purple-200/80">{e.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SeasonProgress() {
  const { state } = useStore()
  const character = state.characters[state.currentPlayer]
  const seasonLevel = Math.min(SEASON_TRACK.length, 1 + Math.floor(character.seasonXp / SEASON_XP_PER_LEVEL))
  const into = character.seasonXp % SEASON_XP_PER_LEVEL
  const pct = Math.round((into / SEASON_XP_PER_LEVEL) * 100)
  const nextReward = SEASON_TRACK[seasonLevel - 1]
  const daysLeft = Math.max(0, Math.ceil((new Date(state.seasonEndsAt).getTime() - Date.now()) / 86400000))

  return (
    <div className="pixel-border bg-[#241a40] p-4">
      <div className="flex items-center justify-between mb-1">
        <div className="text-white font-semibold text-sm">🗓 {state.seasonId}</div>
        <div className="text-xs text-purple-300">{daysLeft}d left</div>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-1.5">
        <div className="h-full bg-linear-to-r from-sky-400 to-fuchsia-400" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-purple-300">
        Season Level {seasonLevel} · дальше: {nextReward?.icon} {nextReward?.reward}
      </div>
    </div>
  )
}

function DailyWeeklyGoal() {
  const { state, dispatch } = useStore()
  const player = state.currentPlayer
  const character = state.characters[player]
  const today = todayKey()

  const doneToday = state.quests.filter((q) => q.status === 'done' && q.completedAt?.slice(0, 10) === today && (q.assignee === player || q.assignee === 'both')).length
  const dailyDone = doneToday >= 5
  const dailyClaimed = character.claimedDaily === today

  const monthKey = new Date().toISOString().slice(0, 7)
  const monthCompleted = state.quests.filter((q) => q.status === 'done' && q.completedAt?.slice(0, 7) === monthKey && (q.assignee === player || q.assignee === 'both')).length
  const goalTarget = 50
  const goalDone = monthCompleted >= goalTarget
  const goalClaimed = character.claimedGoal === monthKey

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="pixel-border bg-[#241a40] p-4">
        <div className="text-white font-semibold text-sm mb-1">🌞 TODAY'S QUEST</div>
        <div className="text-xs text-purple-300 mb-2">Complete 5 quests today</div>
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-2">
          <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, (doneToday / 5) * 100)}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-purple-300">{Math.min(doneToday, 5)}/5 · +100 XP +50🪙</span>
          <button
            disabled={!dailyDone || dailyClaimed}
            onClick={() => dispatch({ type: 'CLAIM_DAILY', player })}
            className="rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5"
          >
            {dailyClaimed ? 'Получено' : 'Забрать'}
          </button>
        </div>
      </div>

      <div className="pixel-border bg-[#241a40] p-4">
        <div className="text-white font-semibold text-sm mb-1">🎯 MONTHLY GOAL</div>
        <div className="text-xs text-purple-300 mb-2">Complete {goalTarget} quests this month</div>
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-2">
          <div className="h-full bg-sky-400" style={{ width: `${Math.min(100, (monthCompleted / goalTarget) * 100)}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-purple-300">{Math.min(monthCompleted, goalTarget)}/{goalTarget} · +300 XP +150🪙</span>
          <button
            disabled={!goalDone || goalClaimed}
            onClick={() => dispatch({ type: 'CLAIM_GOAL', player })}
            className="rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5"
          >
            {goalClaimed ? 'Получено' : 'Забрать'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const { state } = useStore()
  const [editing, setEditing] = useState<Quest | null | undefined>(undefined)
  const character = state.characters[state.currentPlayer]

  const myQuests = useMemo(
    () => state.quests.filter((q) => q.assignee === state.currentPlayer || q.assignee === 'both'),
    [state.quests, state.currentPlayer],
  )
  const todayDone = myQuests.filter((q) => q.status === 'done').length
  const activeQuests = myQuests.filter((q) => q.status !== 'done').slice(0, 4)
  const pct = myQuests.length > 0 ? Math.round((todayDone / myQuests.length) * 100) : 0

  return (
    <div className="space-y-4">
      <CharacterPanel character={character} />
      <EventsBanner />
      <SeasonProgress />
      <DailyWeeklyGoal />

      <div className="pixel-border bg-[#241a40] p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white font-semibold">🌞 TODAY</div>
          <div className="text-sm text-purple-300">{todayDone} / {myQuests.length}</div>
        </div>
        <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-linear-to-r from-emerald-400 to-teal-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-2">⚡ ACTIVE QUESTS</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {activeQuests.map((q) => (
            <QuestCard key={q.id} quest={q} onEdit={(qq) => setEditing(qq)} />
          ))}
          {activeQuests.length === 0 && <div className="text-purple-300/60 text-sm">Нет активных квестов — можно отдохнуть 🌿</div>}
        </div>
      </div>

      {editing !== undefined && <QuestModal quest={editing} onClose={() => setEditing(undefined)} />}
    </div>
  )
}
