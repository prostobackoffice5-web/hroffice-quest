import { useStore } from '../store'
import { ACHIEVEMENTS } from '../data/gamedata'

export function Achievements() {
  const { state } = useStore()
  const character = state.characters[state.currentPlayer]

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">🏆 ACHIEVEMENTS</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = character.unlockedAchievements.includes(a.id)
          return (
            <div key={a.id} className={`pixel-border p-3.5 flex items-center gap-3 ${unlocked ? 'bg-[#2d2350]' : 'bg-[#1e1636] opacity-50'}`}>
              <div className="text-3xl">{unlocked ? a.icon : '🔒'}</div>
              <div>
                <div className="text-white font-semibold">{a.title}</div>
                <div className="text-xs text-purple-300">{a.description}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
