import { useEffect, useState } from 'react'
import type { Quest } from '../types'

export function TimeChallengeTimer({ quest }: { quest: Quest }) {
  const [now, setNow] = useState(Date.now())
  const tc = quest.timeChallenge

  useEffect(() => {
    if (!tc?.startedAt || tc.succeededAt || tc.failedAt) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [tc?.startedAt, tc?.succeededAt, tc?.failedAt])

  if (!tc?.enabled || !tc.startedAt || tc.succeededAt || tc.failedAt) return null

  const totalMs = tc.durationMinutes * 60000
  const elapsed = now - new Date(tc.startedAt).getTime()
  const remaining = Math.max(0, totalMs - elapsed)
  const pct = Math.max(0, Math.min(100, (remaining / totalMs) * 100))
  const critical = remaining <= 30000
  const mins = Math.floor(remaining / 60000)
  const secs = Math.floor((remaining % 60000) / 1000)

  return (
    <div className={`mt-2 rounded-lg p-2 border ${critical ? 'border-red-400 bg-red-500/10 animate-pulse' : 'border-amber-400/40 bg-amber-500/5'}`}>
      <div className="flex items-center justify-between text-xs">
        <span className={critical ? 'text-red-300 font-bold' : 'text-amber-300 font-semibold'}>⚡ TIME CHALLENGE</span>
        <span className={critical ? 'text-red-300 font-bold' : 'text-amber-200'}>
          {mins}:{secs.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden mt-1">
        <div className={`h-full ${critical ? 'bg-red-400' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
