import { useMemo } from 'react'
import { useStore } from '../store'
import { computeStats, levelFromXp } from '../data/engine'

export function Statistics() {
  const { state } = useStore()
  const player = state.currentPlayer
  const character = state.characters[player]
  const stats = computeStats(state, player)

  const byCategoryList = useMemo(() => {
    const entries = Object.entries(stats.byCategory)
    const max = Math.max(1, ...entries.map(([, v]) => v))
    return entries
      .map(([catId, count]) => ({ cat: state.categories.find((c) => c.id === catId), count, pct: (count / max) * 100 }))
      .sort((a, b) => b.count - a.count)
  }, [stats.byCategory, state.categories])

  const tiles = [
    { label: 'Выполнено', value: stats.completed, icon: '✅' },
    { label: 'Активно', value: stats.active, icon: '⚡' },
    { label: 'Просрочено', value: stats.overdue, icon: '🔴' },
    { label: 'Streak', value: `${stats.streak}d`, icon: '🔥' },
    { label: 'Time Challenges', value: stats.timeChallengesWon, icon: '⏱' },
    { label: 'Boss Quests', value: stats.bossesDone, icon: '👾' },
    { label: 'Достижения', value: character.unlockedAchievements.length, icon: '🏆' },
    { label: 'Level', value: levelFromXp(character.xp), icon: '⭐' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">📊 STATISTICS — {character.name}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="pixel-border bg-[#241a40] p-3 text-center">
            <div className="text-xl">{t.icon}</div>
            <div className="text-xl font-bold text-white mt-1">{t.value}</div>
            <div className="text-xs text-purple-300">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="pixel-border bg-[#241a40] p-4">
        <div className="text-white font-semibold mb-3">Выполнение по категориям</div>
        <div className="space-y-2">
          {byCategoryList.map(({ cat, count, pct }) => (
            <div key={cat?.id} className="flex items-center gap-2">
              <div className="w-40 text-sm text-purple-200 truncate">{cat?.icon} {cat?.name}</div>
              <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cat?.color }} />
              </div>
              <div className="w-6 text-right text-sm text-purple-300">{count}</div>
            </div>
          ))}
          {byCategoryList.length === 0 && <div className="text-purple-300/60 text-sm">Пока нет данных</div>}
        </div>
      </div>
    </div>
  )
}
