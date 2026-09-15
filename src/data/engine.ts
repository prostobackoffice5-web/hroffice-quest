import type { AppState, Difficulty, PlayerId, Priority, TimeChallengeMode } from '../types'

// Cumulative XP required to reach each level. Levels 1-7 follow the spec exactly,
// beyond that the per-level XP cost keeps growing by 50 each level.
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
  return { into, span, pct: span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 100, ceiling, floor }
}

export const DIFFICULTY_REWARDS: Record<Difficulty, { xp: number; coins: number; stars: string; label: string }> = {
  easy: { xp: 10, coins: 5, stars: '⭐', label: 'Easy' },
  normal: { xp: 25, coins: 15, stars: '⭐⭐', label: 'Normal' },
  hard: { xp: 50, coins: 30, stars: '⭐⭐⭐', label: 'Hard' },
  epic: { xp: 100, coins: 70, stars: '⭐⭐⭐⭐', label: 'Epic' },
  boss: { xp: 300, coins: 200, stars: '⭐⭐⭐⭐⭐', label: 'Boss' },
}

export const PRIORITY_META: Record<Priority, { icon: string; label: string; color: string }> = {
  low: { icon: '🟢', label: 'Low', color: '#4ade80' },
  medium: { icon: '🟡', label: 'Medium', color: '#facc15' },
  high: { icon: '🟠', label: 'High', color: '#fb923c' },
  urgent: { icon: '🔴', label: 'Urgent', color: '#f87171' },
}

export const TITLES: { level: number; title: string }[] = [
  { level: 1, title: '🌱 Beginner' },
  { level: 5, title: '🛠 Builder' },
  { level: 10, title: '⚔️ Quest Master' },
  { level: 20, title: '👑 Master' },
  { level: 30, title: '✨ Legend' },
]

export function titleForLevel(level: number): string {
  let current = TITLES[0].title
  for (const t of TITLES) {
    if (level >= t.level) current = t.title
  }
  return current
}

export function unlockedTitles(level: number): string[] {
  return TITLES.filter((t) => level >= t.level).map((t) => t.title)
}

export const TIME_CHALLENGE_MODES: Record<TimeChallengeMode, { label: string; minutes: number; bonusMult: number }> = {
  relaxed: { label: 'Relaxed', minutes: 45, bonusMult: 1.3 },
  standard: { label: 'Standard', minutes: 20, bonusMult: 1.6 },
  rush: { label: 'Rush', minutes: 10, bonusMult: 2 },
  extreme: { label: 'Extreme', minutes: 5, bonusMult: 3 },
}

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

export function weekKey(d = new Date()): string {
  const first = new Date(d)
  const day = (first.getDay() + 6) % 7
  first.setDate(first.getDate() - day)
  return first.toISOString().slice(0, 10)
}

export function computeStats(state: AppState, player: PlayerId) {
  const mine = state.quests.filter((q) => q.assignee === player || (q.assignee === 'both' && q.completedByBoth?.includes(player)))
  const completed = mine.filter((q) => q.status === 'done' || q.completedByBoth?.includes(player)).length
  const byCategory: Record<string, number> = {}
  for (const q of mine) {
    if (q.status === 'done' || q.completedByBoth?.includes(player)) {
      byCategory[q.categoryId] = (byCategory[q.categoryId] ?? 0) + 1
    }
  }
  const timeChallengesWon = state.quests.filter((q) => q.timeChallenge?.succeededAt && (q.assignee === player || q.assignee === 'both')).length
  const bossesDone = state.quests.filter((q) => q.difficulty === 'boss' && q.status === 'done' && (q.assignee === player || q.assignee === 'both')).length
  const character = state.characters[player]
  const itemsOwned = character.inventory.length
  const overdue = mine.filter((q) => q.status !== 'done' && q.deadline && new Date(q.deadline).getTime() < Date.now()).length
  return { completed, byCategory, streak: character.streak, timeChallengesWon, bossesDone, itemsOwned, overdue, active: mine.filter((q) => q.status !== 'done').length }
}
