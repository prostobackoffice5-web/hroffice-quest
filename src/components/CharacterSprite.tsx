import { motion } from 'framer-motion'
import type { Appearance } from '../types'

const ACCESSORY_COLORS: Record<string, string> = {
  glasses: '#38bdf8',
  hat: '#a3612e',
  cape: '#7c3aed',
}

export function CharacterSprite({ appearance, size = 40, animate = true }: { appearance: Appearance; size?: number; animate?: boolean }) {
  const scale = size / 40
  return (
    <motion.div
      style={{ width: size, height: size * 1.2, position: 'relative' }}
      animate={animate ? { y: [0, -3, 0] } : undefined}
      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
    >
      {appearance.accessory === 'cape' && (
        <div style={{ position: 'absolute', top: 8 * scale, left: -4 * scale, width: 10 * scale, height: 26 * scale, background: ACCESSORY_COLORS.cape, border: '2px solid #1f150d' }} />
      )}
      {/* legs */}
      <div style={{ position: 'absolute', bottom: 0, left: 6 * scale, width: 10 * scale, height: 12 * scale, background: appearance.shoesColor, border: '2px solid #1f150d' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 6 * scale, width: 10 * scale, height: 12 * scale, background: appearance.shoesColor, border: '2px solid #1f150d' }} />
      {/* body */}
      <div style={{ position: 'absolute', top: 14 * scale, left: 4 * scale, width: 32 * scale, height: 18 * scale, background: appearance.outfitColor, border: '2px solid #1f150d' }} />
      {/* head */}
      <div style={{ position: 'absolute', top: 0, left: 8 * scale, width: 24 * scale, height: 18 * scale, background: appearance.skinColor, border: '2px solid #1f150d' }} />
      {/* hair */}
      <div style={{ position: 'absolute', top: -2 * scale, left: 6 * scale, width: 28 * scale, height: 8 * scale, background: appearance.hairColor, border: '2px solid #1f150d' }} />
      {appearance.accessory === 'glasses' && (
        <div style={{ position: 'absolute', top: 8 * scale, left: 10 * scale, width: 20 * scale, height: 4 * scale, background: ACCESSORY_COLORS.glasses, opacity: 0.85 }} />
      )}
      {appearance.accessory === 'hat' && (
        <div style={{ position: 'absolute', top: -8 * scale, left: 6 * scale, width: 28 * scale, height: 8 * scale, background: ACCESSORY_COLORS.hat, border: '2px solid #1f150d' }} />
      )}
    </motion.div>
  )
}
