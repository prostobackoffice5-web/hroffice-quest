import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { SHOP_ITEMS, RARITY_META } from '../data/gamedata'
import { levelFromXp } from '../data/engine'
import type { EquipmentSlot } from '../types'

const TABS: { id: EquipmentSlot | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'hair', label: 'Hair' },
  { id: 'clothes', label: 'Clothes' },
  { id: 'accessory', label: 'Accessories' },
  { id: 'effect', label: 'Effects' },
  { id: 'furniture', label: 'Furniture' },
]

export function Shop() {
  const { state, dispatch } = useStore()
  const [tab, setTab] = useState<EquipmentSlot | 'all'>('all')
  const character = state.characters[state.currentPlayer]
  const level = levelFromXp(character.xp)

  const items = useMemo(() => SHOP_ITEMS.filter((i) => tab === 'all' || i.slot === tab), [tab])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">🛒 SHOP</h2>
        <div className="text-amber-300 font-semibold">🪙 {character.coins}</div>
      </div>
      <div className="flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-sm px-3 py-1.5 rounded-lg whitespace-nowrap ${tab === t.id ? 'bg-white/15 text-white font-semibold' : 'text-purple-300 hover:bg-white/5'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const owned = character.inventory.some((i) => i.itemId === item.id)
          const locked = item.unlockLevel && level < item.unlockLevel
          const rarity = RARITY_META[item.rarity]
          return (
            <div key={item.id} className="pixel-border bg-[#241a40] p-3.5" style={{ borderTop: `3px solid ${rarity.color}` }}>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{item.name}</div>
                  <div className="text-xs" style={{ color: rarity.color }}>{rarity.label}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-amber-300">🪙 {item.price}</div>
                {owned ? (
                  <span className="text-xs text-emerald-400 font-semibold">В инвентаре</span>
                ) : locked ? (
                  <span className="text-xs text-purple-400">🔒 Level {item.unlockLevel}</span>
                ) : (
                  <button
                    disabled={character.coins < item.price}
                    onClick={() => dispatch({ type: 'BUY_ITEM', player: state.currentPlayer, itemId: item.id })}
                    className="rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5"
                  >
                    Купить
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
