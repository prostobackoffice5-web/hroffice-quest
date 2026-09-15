import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { ACTION_DEFS } from '../data/actions'
import type { PlayerId } from '../types'

export function ActionWheel({ target, onClose }: { target: PlayerId; onClose: () => void }) {
  const { state, dispatch } = useStore()
  const me = state.currentPlayer!
  const character = state.characters[me]
  const available = ACTION_DEFS.filter((a) => character.ownedActions.includes(a.id) && a.id !== 'message')
  const radius = 100
  const targetName = state.characters[target].name

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="relative" style={{ width: radius * 2 + 60, height: radius * 2 + 60 }}>
          <div className="absolute inset-0 flex items-center justify-center text-[#eef3f6] font-bold text-sm pixel-window px-3 py-1.5" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 120 }}>
            {targetName}
          </div>
          {available.map((a, i) => {
            const angle = (i / available.length) * Math.PI * 2 - Math.PI / 2
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            return (
              <motion.button
                key={a.id}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ scale: 1, x, y }}
                exit={{ scale: 0, x: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.02 }}
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch({ type: 'PERFORM_ACTION', from: me, to: target, actionId: a.id })
                  onClose()
                }}
                className="absolute pixel-btn bg-[#243544] text-[#eef3f6] flex flex-col items-center justify-center"
                style={{ left: '50%', top: '50%', width: 64, height: 64, marginLeft: -32, marginTop: -32 }}
                title={a.label}
              >
                <span className="text-xl">{a.icon}</span>
                <span className="text-[9px] leading-tight">{a.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
