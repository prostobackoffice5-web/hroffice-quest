const BASE_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1350]

export function xpThreshold(level: number): number {
  if (level <= 1) return 0
  if (level - 1 < BASE_THRESHOLDS.length) return BASE_THRESHOLDS[level - 1]
  let total = BASE_THRESHOLDS[BASE_THRESHOLDS.length - 1]
  let step = 350
  for (let lv = BASE_THRESHOLDS.length + 1; lv <= level; lv++) {
    total += step
    step += 50
  }
  return total
}

export function levelFromXp(totalXp: number): number {
  let level = 1
  while (xpThreshold(level + 1) <= totalXp) level++
  return level
}

export function xpProgress(totalXp: number, level: number) {
  const floor = xpThreshold(level)
  const ceiling = xpThreshold(level + 1)
  const span = ceiling - floor
  const into = totalXp - floor
  return { into, span, pct: span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 100 }
}
