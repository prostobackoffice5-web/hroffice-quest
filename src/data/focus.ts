export const FOCUS_PRESETS = [15, 25, 45, 60]

export function formatMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = Math.round(totalMinutes % 60)
  if (h === 0) return `${m} мин`
  return `${h} ч ${m} мин`
}

export const FOCUS_ACHIEVEMENT_DEFS = [
  { id: 'focus-1', title: 'Первый фокус', check: (s: FocusStats) => s.sessions >= 1 },
  { id: 'focus-5', title: 'Помидор созрел', check: (s: FocusStats) => s.sessions >= 5 },
  { id: 'focus-flow', title: 'В потоке', check: (s: FocusStats) => s.maxSessionsInOneDay >= 3 },
  { id: 'focus-deep', title: 'Глубокая концентрация', check: (s: FocusStats) => s.maxSingleSessionMinutes >= 60 },
  { id: 'focus-10h', title: 'Время работает', check: (s: FocusStats) => s.totalMinutes >= 600 },
  { id: 'focus-50h', title: 'Глубокие корни', check: (s: FocusStats) => s.totalMinutes >= 3000 },
  { id: 'focus-100h', title: 'Хозяин времени', check: (s: FocusStats) => s.totalMinutes >= 6000 },
]

export interface FocusStats {
  sessions: number
  totalMinutes: number
  maxSessionsInOneDay: number
  maxSingleSessionMinutes: number
}
