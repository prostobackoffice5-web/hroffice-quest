import { levelFromXp, xpProgress } from '../data/engine'

export function XpBar({ xp, coins, sparks }: { xp: number; coins: number; sparks?: number }) {
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
      <div className="flex items-center gap-3 text-xs mt-1">
        <span className="text-[#facc15]">Монет: {coins}</span>
        {sparks !== undefined && <span className="text-[#a78bfa]">Искры: {sparks}</span>}
      </div>
    </div>
  )
}
