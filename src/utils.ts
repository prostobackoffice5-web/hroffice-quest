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
