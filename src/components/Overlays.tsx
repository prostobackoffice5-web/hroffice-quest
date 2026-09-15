import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

export function LevelUpOverlay() {
  const { state, dispatch } = useStore()
  const info = state.lastLevelUp

  useEffect(() => {
    if (!info) return
    const t = setTimeout(() => dispatch({ type: 'CLEAR_LEVEL_UP' }), 2800)
    return () => clearTimeout(t)
  }, [info, dispatch])

  return (
    <AnimatePresence>
      {info && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch({ type: 'CLEAR_LEVEL_UP' })}
        >
          <motion.div
            className="pixel-border bg-linear-to-br from-amber-400 to-fuchsia-500 p-8 text-center"
            initial={{ scale: 0.6, rotate: -4 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          >
            <div className="text-5xl mb-2">✨⬆️✨</div>
            <div className="text-3xl font-black text-white drop-shadow">LEVEL UP!</div>
            <div className="text-white/90 mt-1">
              {state.characters[info.player].name} достигла уровня {info.level}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function RewardToast() {
  const { state, dispatch } = useStore()
  const reward = state.lastReward

  useEffect(() => {
    if (!reward) return
    const t = setTimeout(() => dispatch({ type: 'CLEAR_REWARD' }), 1600)
    return () => clearTimeout(t)
  }, [reward, dispatch])

  return (
    <AnimatePresence>
      {reward && (
        <motion.div
          key={reward.key}
          className="fixed top-20 right-6 z-[70] pixel-border bg-[#241a40] px-4 py-2 text-sm font-semibold text-amber-300"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: -6, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
        >
          +{reward.xp} XP &nbsp; +{reward.coins} 🪙
        </motion.div>
      )}
    </AnimatePresence>
  )
}
