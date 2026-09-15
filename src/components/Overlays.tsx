import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

export function LevelUpOverlay() {
  const { state, dispatch } = useStore()
  const info = state.lastLevelUp

  useEffect(() => {
    if (!info) return
    const t = setTimeout(() => dispatch({ type: 'CLEAR_LEVEL_UP' }), 2400)
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
            className="pixel-window px-8 py-6 text-center"
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          >
            <div className="text-2xl font-black text-[#facc15]">Новый уровень!</div>
            <div className="text-[#eef3f6] mt-1">
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
    const t = setTimeout(() => dispatch({ type: 'CLEAR_REWARD' }), 1500)
    return () => clearTimeout(t)
  }, [reward, dispatch])

  return (
    <AnimatePresence>
      {reward && (
        <motion.div
          key={reward.key}
          className="fixed top-4 right-4 z-[70] pixel-window px-4 py-2 text-sm font-semibold text-[#facc15]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          +{reward.xp} опыта · +{reward.coins} монет{reward.sparks > 0 ? ` · +${reward.sparks} искр` : ''}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
