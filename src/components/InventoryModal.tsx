import { Star } from 'lucide-react'
import { ModalShell } from './ModalShell'
import { useStore, allShopItems } from '../store'
import { RARITY_COLORS, RARITY_LABELS } from '../data/shopItems'
import { ItemIcon } from './ItemIcon'

export function InventoryModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore()
  const player = state.currentPlayer!
  const character = state.characters[player]
  const items = allShopItems(state)
  const slots = Array.from({ length: Math.max(20, character.inventory.length) })

  return (
    <ModalShell title="Инвентарь" onClose={onClose} wide>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {slots.map((_, idx) => {
          const entry = character.inventory[idx]
          const item = entry ? items.find((i) => i.id === entry.itemId) : null
          const equipped = item && (character.equippedOutfit === item.id || character.equippedAccessory === item.id)
          return (
            <div key={idx} className="pixel-slot aspect-square flex flex-col items-center justify-center gap-1 p-1 relative" style={item ? { boxShadow: `inset 0 0 0 2px ${RARITY_COLORS[item.rarity]}` } : undefined}>
              {item ? (
                <>
                  <button onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', player, itemId: item.id })} className="absolute top-1 right-1">
                    <Star size={12} className={entry?.favorite ? 'fill-[#facc15] text-[#facc15]' : 'text-[#31485a]'} />
                  </button>
                  <ItemIcon name={item.name} color={item.color} size={36} />
                  <span className="text-[9px] text-[#9fb2bf] text-center leading-tight">{item.name}</span>
                  <span className="text-[8px]" style={{ color: RARITY_COLORS[item.rarity] }}>{RARITY_LABELS[item.rarity]}</span>
                  {item.slot !== 'furniture' && (
                    <button
                      onClick={() =>
                        equipped
                          ? dispatch({ type: 'UNEQUIP_SLOT', player, slot: item.slot as 'outfit' | 'accessory' })
                          : dispatch({ type: 'EQUIP_ITEM', player, itemId: item.id })
                      }
                      className={`pixel-btn text-[9px] px-1.5 py-0.5 ${equipped ? 'bg-[#d1495b] text-white' : 'bg-[#2fae7a] text-white'}`}
                    >
                      {equipped ? 'Снять' : 'Надеть'}
                    </button>
                  )}
                  {item.slot === 'furniture' && (
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_FURNITURE', player, itemId: item.id })}
                      className={`pixel-btn text-[9px] px-1.5 py-0.5 ${character.homeFurniture.includes(item.id) ? 'bg-[#d1495b] text-white' : 'bg-[#2fae7a] text-white'}`}
                    >
                      {character.homeFurniture.includes(item.id) ? 'Убрать из дома' : 'Поставить в дом'}
                    </button>
                  )}
                </>
              ) : (
                <span className="text-[#5a4530] text-xs">пусто</span>
              )}
            </div>
          )
        })}
      </div>
    </ModalShell>
  )
}
