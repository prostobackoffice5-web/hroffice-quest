import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ModalShell({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`pixel-window ${wide ? 'max-w-2xl' : 'max-w-md'} w-full max-h-[88vh] overflow-y-auto`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pixel-window-title">
            <span>{title}</span>
            <button onClick={onClose} className="pixel-btn-x">×</button>
          </div>
          <div className="p-4">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
