import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { PRIORITY_META } from '../data/engine'

type View = 'day' | 'week' | 'month'

function inRange(date: Date, from: Date, to: Date) {
  return date.getTime() >= from.getTime() && date.getTime() <= to.getTime()
}

export function Calendar() {
  const { state } = useStore()
  const [view, setView] = useState<View>('week')

  const { from, to } = useMemo(() => {
    const now = new Date()
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    if (view === 'day') end.setDate(end.getDate() + 1)
    if (view === 'week') end.setDate(end.getDate() + 7)
    if (view === 'month') end.setMonth(end.getMonth() + 1)
    return { from: start, to: end }
  }, [view])

  const items = useMemo(() => {
    return state.quests
      .filter((q) => q.deadline && inRange(new Date(q.deadline), from, to))
      .filter((q) => q.assignee === state.currentPlayer || q.assignee === 'both')
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
  }, [state.quests, from, to, state.currentPlayer])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>()
    for (const q of items) {
      const key = new Date(q.deadline!).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', weekday: 'short' })
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(q)
    }
    return Array.from(map.entries())
  }, [items])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">📅 CALENDAR</h2>
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(['day', 'week', 'month'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-sm px-3 py-1 rounded-md capitalize ${view === v ? 'bg-fuchsia-500 text-white' : 'text-purple-200 hover:bg-white/10'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {grouped.length === 0 && <div className="text-purple-300/60 text-sm text-center py-10">Нет квестов с дедлайном в этом диапазоне</div>}

      {grouped.map(([date, qs]) => (
        <div key={date} className="pixel-border bg-[#241a40] p-3.5">
          <div className="text-purple-300 text-xs font-semibold mb-2 uppercase">{date}</div>
          <div className="space-y-1.5">
            {qs.map((q) => (
              <div key={q.id} className="flex items-center gap-2 text-sm text-white">
                <span>{PRIORITY_META[q.priority].icon}</span>
                <span className={q.status === 'done' ? 'line-through text-purple-400' : ''}>{q.title}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
