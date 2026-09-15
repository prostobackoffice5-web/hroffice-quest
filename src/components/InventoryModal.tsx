import { ModalShell } from './ModalShell'
import { useStore } from '../store'
import { SHOP_ITEMS } from '../data/gamedata'

export function InventoryModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore()
  const player = state.currentPlayer!
  const character = state.characters[player]
  const slots = Array.from({ length: 16 })

  return (
    <ModalShell title="Инвентарь" onClose={onClose} wide>
      <div className="grid grid-cols-4 gap-2">
        {slots.map((_, idx) => {
          const entry = character.inventory[idx]
          const item = entry ? SHOP_ITEMS.find((i) => i.id === entry.itemId) : null
          const equipped = item && (character.equippedOutfit === item.id || character.equippedAccessory === item.id)
          return (
            <div key={idx} className="pixel-slot aspect-square flex flex-col items-center justify-center gap-1 p-1 relative">
              {item ? (
                <>
                  <div className="w-6 h-6" style={{ background: item.color, border: '2px solid #1f150d' }} />
                  <span className="text-[10px] text-[#d8c9a8] text-center leading-tight">{item.name}</span>
                  {item.slot !== 'furniture' && (
                    <button
                      onClick={() =>
                        equipped
                          ? dispatch({ type: 'UNEQUIP_SLOT', player, slot: item.slot as 'outfit' | 'accessory' })
                          : dispatch({ type: 'EQUIP_ITEM', player, itemId: item.id })
                      }
                      className={`pixel-btn text-[10px] px-1.5 py-0.5 ${equipped ? 'bg-[#8b3a3a] text-white' : 'bg-[#3f7d3a] text-white'}`}
                    >
                      {equipped ? 'Снять' : 'Надеть'}
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
