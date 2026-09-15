import { ModalShell } from './ModalShell'
import { useStore } from '../store'
import { ACHIEVEMENT_DEFS } from '../data/gamedata'
import { FOCUS_ACHIEVEMENT_DEFS, type FocusStats } from '../data/focus'
import type { AppState, PlayerId } from '../types'

function computeFocusStats(state: AppState, player: PlayerId): FocusStats {
  const sessions = state.focusSessions.filter((s) => s.player === player)
  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0)
  const byDay = new Map<string, number>()
  for (const s of sessions) {
    const day = s.startedAt.slice(0, 10)
    byDay.set(day, (byDay.get(day) ?? 0) + 1)
  }
  const maxSessionsInOneDay = Math.max(0, ...byDay.values())
  const maxSingleSessionMinutes = Math.max(0, ...sessions.map((s) => s.minutes))
  return { sessions: sessions.length, totalMinutes, maxSessionsInOneDay, maxSingleSessionMinutes }
}

export function AchievementsModal({ onClose }: { onClose: () => void }) {
  const { state } = useStore()
  const player = state.currentPlayer!
  const done = state.tasks.filter((t) => (t.assignee === player || t.assignee === 'both') && t.status === 'done').length
  const focusStats = computeFocusStats(state, player)

  return (
    <ModalShell title="Достижения" onClose={onClose} wide>
      <div className="text-sm text-[#facc15] font-semibold mb-2">Работа</div>
      <div className="space-y-2 mb-4">
        {ACHIEVEMENT_DEFS.map((a) => {
          const unlocked = done >= a.target
          return (
            <div key={a.id} className={`pixel-panel p-3 flex items-center justify-between ${unlocked ? '' : 'opacity-50'}`}>
              <span className="text-[#f3e9d2]">{a.title}</span>
              <span className="text-xs text-[#d8c9a8]">{unlocked ? 'Открыто' : `${done}/${a.target}`}</span>
            </div>
          )
        })}
      </div>

      <div className="text-sm text-[#facc15] font-semibold mb-2">Фокус</div>
      <div className="space-y-2">
        {FOCUS_ACHIEVEMENT_DEFS.map((a) => {
          const unlocked = a.check(focusStats)
          return (
            <div key={a.id} className={`pixel-panel p-3 flex items-center justify-between ${unlocked ? '' : 'opacity-50'}`}>
              <span className="text-[#f3e9d2]">{a.title}</span>
              <span className="text-xs text-[#d8c9a8]">{unlocked ? 'Открыто' : '🔒'}</span>
            </div>
          )
        })}
      </div>
    </ModalShell>
  )
}
