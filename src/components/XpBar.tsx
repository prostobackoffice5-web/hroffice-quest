import { levelFromXp, xpProgress } from '../data/engine'

export function XpBar({ xp, coins }: { xp: number; coins: number }) {
  const level = levelFromXp(xp)
  const { into, span, pct } = xpProgress(xp, level)
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-[#d8c9a8] mb-1">
        <span>Уровень {level}</span>
        <span>{into}/{span} опыта</span>
      </div>
      <div className="h-3 pixel-slot overflow-hidden">
        <div className="h-full bg-[#facc15]" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-[#facc15] mt-1">Монет: {coins}</div>
    </div>
  )
}
