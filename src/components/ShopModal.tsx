import { ModalShell } from './ModalShell'
import { useStore } from '../store'
import { SHOP_ITEMS } from '../data/gamedata'

export function ShopModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore()
  const player = state.currentPlayer!
  const character = state.characters[player]

  return (
    <ModalShell title="Магазин" onClose={onClose} wide>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[#d8c9a8]">Товары</span>
        <span className="text-[#facc15] font-semibold">Монет: {character.coins}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {SHOP_ITEMS.map((item) => {
          const owned = character.inventory.some((i) => i.itemId === item.id)
          return (
            <div key={item.id} className="pixel-slot p-2 flex flex-col items-center gap-1.5">
              <div className="w-8 h-8" style={{ background: item.color, border: '2px solid #1f150d' }} />
              <span className="text-[11px] text-[#f3e9d2] text-center leading-tight">{item.name}</span>
              <span className="text-[11px] text-[#facc15]">{item.price} монет</span>
              {owned ? (
                <span className="text-[10px] text-[#4ade80]">Куплено</span>
              ) : (
                <button
                  disabled={character.coins < item.price}
                  onClick={() => dispatch({ type: 'BUY_ITEM', player, itemId: item.id })}
                  className="pixel-btn bg-[#3f7d3a] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] px-2 py-1"
                >
                  Купить
                </button>
              )}
            </div>
          )
        })}
      </div>
    </ModalShell>
  )
}
