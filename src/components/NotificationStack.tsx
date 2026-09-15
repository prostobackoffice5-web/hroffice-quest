import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

export function NotificationStack() {
  const { state, dispatch } = useStore()
  const player = state.currentPlayer
  const mine = player ? state.notifications.filter((n) => n.player === player).slice(0, 4) : []

  useEffect(() => {
    if (mine.length === 0) return
    const timers = mine.map((n) => setTimeout(() => dispatch({ type: 'DISMISS_NOTIFICATION', id: n.id }), 4000))
    return () => timers.forEach(clearTimeout)
  }, [mine.map((n) => n.id).join(','), dispatch])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[65] flex flex-col gap-1.5 items-center">
      <AnimatePresence>
        {mine.map((n) => (
          <motion.div
            key={n.id}
            className="pixel-window px-3 py-1.5 text-xs flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span>{n.icon}</span>
            <span>{n.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
