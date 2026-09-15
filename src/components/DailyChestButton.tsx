import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

export function DailyChestButton() {
  const { state, dispatch } = useStore()
  const [openId, setOpenId] = useState<string | null>(null)
  const pending = state.chests.filter((c) => c.player === state.currentPlayer && !c.opened)
  const active = state.chests.find((c) => c.id === openId)

  if (pending.length === 0) return null

  return (
    <>
      <button onClick={() => setOpenId(pending[0].id)} className="pixel-btn bg-[#facc15] text-[#12181f] text-xs font-bold px-3 py-1.5 animate-pulse">
        🎁 Сундук дня
      </button>
      <AnimatePresence>
        {active && (
          <motion.div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="pixel-window p-8 text-center max-w-xs" initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
              {!active.opened ? (
                <>
                  <motion.div className="text-6xl mb-4" animate={{ rotate: [0, -8, 8, -8, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>🎁</motion.div>
                  <div className="text-[#eef3f6] font-bold mb-4">Сундук дня</div>
                  <button onClick={() => dispatch({ type: 'OPEN_CHEST', chestId: active.id })} className="pixel-btn bg-[#2fae7a] text-white px-4 py-2">Открыть</button>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-3">✨</div>
                  <div className="text-[#eef3f6] font-bold mb-2">Награда получена!</div>
                  <div className="text-[#facc15] text-sm mb-1">+{active.reward?.coins} монет{active.reward?.sparks ? ` · +${active.reward.sparks} искр` : ''}</div>
                  <button onClick={() => setOpenId(null)} className="mt-4 pixel-btn bg-[#243544] text-[#eef3f6] px-4 py-2 text-sm">Закрыть</button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
