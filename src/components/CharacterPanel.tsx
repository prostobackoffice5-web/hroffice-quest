import { motion } from 'framer-motion'
import type { Character } from '../types'
import { levelFromXp, xpProgress } from '../data/engine'

export function CharacterPanel({ character, compact = false }: { character: Character; compact?: boolean }) {
  const level = levelFromXp(character.xp)
  const { into, span, pct } = xpProgress(character.xp, level)

  return (
    <div className="pixel-border bg-linear-to-br from-[#2a1f4d] to-[#1b1230] p-4 flex items-center gap-4">
      <motion.div
        className="flex items-center justify-center rounded-xl text-4xl shrink-0"
        style={{ width: compact ? 56 : 72, height: compact ? 56 : 72, background: character.appearance.outfitColor + '33', border: `2px solid ${character.appearance.outfitColor}` }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      >
        {character.appearance.emoji}
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="text-white font-semibold truncate">{character.name}</div>
          <div className="text-xs text-purple-200/80">{character.title}</div>
        </div>
        <div className="text-xs text-purple-300 mb-1">LEVEL {level}</div>
        <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-fuchsia-400 to-amber-300"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-purple-200/80">
          <span>{into}/{span} XP</span>
          <span>🪙 {character.coins}</span>
          <span>🔥 {character.streak}d</span>
        </div>
      </div>
    </div>
  )
}
