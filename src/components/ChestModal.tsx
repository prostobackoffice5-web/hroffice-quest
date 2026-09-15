import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { SHOP_ITEMS } from '../data/gamedata'

export function ChestButton() {
  const { state, dispatch } = useStore()
  const [openChestId, setOpenChestId] = useState<string | null>(null)
  const pending = state.chests.filter((c) => c.player === state.currentPlayer && !c.opened)
  const activeChest = state.chests.find((c) => c.id === openChestId)

  if (pending.length === 0) return null

  return (
    <>
      <button
        onClick={() => setOpenChestId(pending[0].id)}
        className="rounded-lg bg-amber-400/90 hover:bg-amber-300 text-[#241a40] text-xs font-bold px-3 py-1.5 animate-pulse"
      >
        🎁 Chests ({pending.length})
      </button>
      <AnimatePresence>
        {activeChest && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pixel-border bg-[#241a40] p-8 text-center max-w-xs"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
            >
              {!activeChest.opened ? (
                <>
                  <motion.div className="text-6xl mb-4" animate={{ rotate: [0, -8, 8, -8, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    🎁
                  </motion.div>
                  <div className="text-white font-bold mb-4">Mystery Chest</div>
                  <button
                    onClick={() => dispatch({ type: 'OPEN_CHEST', chestId: activeChest.id })}
                    className="rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-semibold px-4 py-2"
                  >
                    Открыть
                  </button>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-3">✨</div>
                  <div className="text-white font-bold mb-2">Награда получена!</div>
                  <div className="text-amber-300 text-sm mb-1">+{activeChest.reward?.xp} XP · +{activeChest.reward?.coins} 🪙</div>
                  {activeChest.reward?.itemId && (
                    <div className="text-sm text-purple-200">
                      {SHOP_ITEMS.find((i) => i.id === activeChest.reward?.itemId)?.icon}{' '}
                      {SHOP_ITEMS.find((i) => i.id === activeChest.reward?.itemId)?.name}
                    </div>
                  )}
                  <button onClick={() => setOpenChestId(null)} className="mt-4 rounded-lg bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm">
                    Закрыть
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
