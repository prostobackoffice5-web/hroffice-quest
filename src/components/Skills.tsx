import { useStore } from '../store'

const SKILL_XP_PER_LEVEL = 80

function skillLevel(xp: number) {
  return 1 + Math.floor(xp / SKILL_XP_PER_LEVEL)
}

export function Skills() {
  const { state } = useStore()
  const character = state.characters[state.currentPlayer]

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">🧠 SKILLS</h2>
      <div className="space-y-3">
        {character.skills.map((s) => {
          const lvl = skillLevel(s.xp)
          const into = s.xp % SKILL_XP_PER_LEVEL
          const pct = Math.round((into / SKILL_XP_PER_LEVEL) * 100)
          return (
            <div key={s.id} className="pixel-border bg-[#241a40] p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-white font-medium">{s.icon} {s.name}</div>
                <div className="text-sm text-purple-300">Level {lvl}</div>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-linear-to-r from-sky-400 to-emerald-300" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
