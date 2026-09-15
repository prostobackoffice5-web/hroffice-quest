import { useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { useStore } from '../store'
import { SHOP_ITEMS, RARITY_META } from '../data/gamedata'
import type { EquipmentSlot } from '../types'

const TABS: { id: EquipmentSlot | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Всё', icon: '🎒' },
  { id: 'clothes', label: 'Clothes', icon: '👕' },
  { id: 'hair', label: 'Hair', icon: '💇' },
  { id: 'accessory', label: 'Accessories', icon: '🎒' },
  { id: 'effect', label: 'Effects', icon: '✨' },
  { id: 'furniture', label: 'Furniture', icon: '🏠' },
]

export function Inventory() {
  const { state, dispatch } = useStore()
  const [tab, setTab] = useState<EquipmentSlot | 'all'>('all')
  const character = state.characters[state.currentPlayer]

  const owned = useMemo(
    () =>
      character.inventory
        .map((entry) => ({ entry, item: SHOP_ITEMS.find((i) => i.id === entry.itemId) }))
        .filter((x) => x.item && (tab === 'all' || x.item.slot === tab)),
    [character.inventory, tab],
  )

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">🎒 INVENTORY</h2>
      <div className="flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-sm px-3 py-1.5 rounded-lg whitespace-nowrap ${tab === t.id ? 'bg-white/15 text-white font-semibold' : 'text-purple-300 hover:bg-white/5'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {owned.map(({ entry, item }) => {
          if (!item) return null
          const rarity = RARITY_META[item.rarity]
          const equipped = item.slot !== 'furniture' && (character.equipment as any)[item.slot] === item.id
          return (
            <div key={item.id} className="pixel-border bg-[#241a40] p-3.5" style={{ borderTop: `3px solid ${rarity.color}` }}>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{item.name}</div>
                  <div className="text-xs" style={{ color: rarity.color }}>{rarity.label}</div>
                </div>
                <button onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', player: state.currentPlayer, itemId: item.id })}>
                  <Star size={16} className={entry.favorite ? 'fill-amber-300 text-amber-300' : 'text-purple-400'} />
                </button>
              </div>
              {item.slot !== 'furniture' && (
                <div className="mt-3">
                  {equipped ? (
                    <button
                      onClick={() => dispatch({ type: 'UNEQUIP_SLOT', player: state.currentPlayer, slot: item.slot as any })}
                      className="w-full rounded-lg bg-white/10 hover:bg-white/20 text-purple-100 text-xs font-semibold px-3 py-1.5"
                    >
                      Снять
                    </button>
                  ) : (
                    <button
                      onClick={() => dispatch({ type: 'EQUIP_ITEM', player: state.currentPlayer, itemId: item.id })}
                      className="w-full rounded-lg bg-emerald-500/90 hover:bg-emerald-400 text-white text-xs font-semibold px-3 py-1.5"
                    >
                      Надеть
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
        {owned.length === 0 && <div className="text-purple-300/60 text-sm col-span-2 text-center py-10">Пока пусто — загляни в Shop</div>}
      </div>
    </div>
  )
}
