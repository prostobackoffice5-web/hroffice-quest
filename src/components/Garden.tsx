import { motion } from 'framer-motion'
import { useStore } from '../store'
import { TILE } from '../data/world'
import type { PlayerId } from '../types'

const OFFSETS = [
  { dx: -0.6, dy: 0.4 },
  { dx: 0.9, dy: 0.5 },
  { dx: -0.3, dy: 0.8 },
  { dx: 0.5, dy: 0.85 },
  { dx: -0.8, dy: 0.1 },
  { dx: 1.0, dy: 0.1 },
]

function flowerColor(index: number, urgent: boolean): string {
  if (urgent) return '#4ade80' // клевер за срочные задачи
  const palette = ['#f472b6', '#facc15', '#f87171', '#a78bfa', '#38bdf8']
  return palette[index % palette.length]
}

export function Garden({ player, x, y }: { player: PlayerId; x: number; y: number }) {
  const { state } = useStore()
  const doneTasks = state.tasks.filter((t) => (t.assignee === player || t.assignee === 'both') && t.status === 'done')
  const count = Math.min(OFFSETS.length, Math.floor(doneTasks.length / 3))

  if (count === 0) return null

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const off = OFFSETS[i]
        const wasUrgent = doneTasks[i]?.urgent
        return (
          <motion.div
            key={i}
            className="absolute text-lg pointer-events-none"
            style={{ left: x * TILE + TILE * 0.5 + off.dx * TILE * 0.4, top: y * TILE + TILE * 0.5 + off.dy * TILE * 0.4 }}
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 2.4 + i * 0.2, ease: 'easeInOut' }}
          >
            <span style={{ filter: `drop-shadow(0 0 2px ${flowerColor(i, !!wasUrgent)})` }}>🌸</span>
          </motion.div>
        )
      })}
    </>
  )
}
