import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'
import { ACTION_DEFS } from '../data/actions'
import { TILE } from '../data/world'

export function WorldEventFx() {
  const { state } = useStore()
  const now = Date.now()
  const recent = state.worldEvents.filter((e) => now - new Date(e.createdAt).getTime() < 1800)

  return (
    <AnimatePresence>
      {recent.map((e) => {
        const def = ACTION_DEFS.find((a) => a.id === e.actionId)
        const target = state.characters[e.to]
        if (!def) return null
        return (
          <motion.div
            key={e.id}
            className="absolute pointer-events-none text-2xl"
            style={{ left: target.position.x * TILE + TILE / 2 - 12, top: target.position.y * TILE - 20 }}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -16, scale: 1.3 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.6 }}
          >
            {def.icon}
          </motion.div>
        )
      })}
    </AnimatePresence>
  )
}
