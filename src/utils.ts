export type DeadlineStatus = 'none' | 'upcoming' | 'today' | 'overdue'

export function deadlineStatus(deadline?: string): DeadlineStatus {
  if (!deadline) return 'none'
  const now = new Date()
  const d = new Date(deadline)
  const todayStr = now.toDateString()
  if (d.toDateString() === todayStr) return 'today'
  if (d.getTime() < now.getTime()) return 'overdue'
  return 'upcoming'
}

export function formatDeadline(deadline?: string): string {
  if (!deadline) return ''
  const d = new Date(deadline)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  let r = (num >> 16) + Math.round(255 * percent)
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * percent)
  let b = (num & 0x0000ff) + Math.round(255 * percent)
  r = Math.max(0, Math.min(255, r))
  g = Math.max(0, Math.min(255, g))
  b = Math.max(0, Math.min(255, b))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
