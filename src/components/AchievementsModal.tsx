import { ModalShell } from './ModalShell'
import { useStore } from '../store'
import { ACHIEVEMENT_DEFS } from '../data/gamedata'

export function AchievementsModal({ onClose }: { onClose: () => void }) {
  const { state } = useStore()
  const player = state.currentPlayer!
  const done = state.tasks.filter((t) => t.assignee === player && t.status === 'done').length

  return (
    <ModalShell title="Достижения" onClose={onClose}>
      <div className="space-y-2">
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
    </ModalShell>
  )
}
