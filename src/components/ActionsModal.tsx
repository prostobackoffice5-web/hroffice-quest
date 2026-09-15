import { ModalShell } from './ModalShell'
import { useStore } from '../store'
import { ACTION_DEFS } from '../data/actions'

const RARITY_LABEL: Record<string, string> = { common: 'Обычное', uncommon: 'Необычное', rare: 'Редкое', epic: 'Эпическое', event: 'Ивентовое' }

export function ActionsModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore()
  const player = state.currentPlayer!
  const character = state.characters[player]
  const purchasable = ACTION_DEFS.filter((a) => a.id !== 'message')

  return (
    <ModalShell title="Действия" onClose={onClose} wide>
      <div className="text-sm text-[#d8c9a8] mb-3">Получено: {character.ownedActions.length} / {ACTION_DEFS.length}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        {purchasable.map((a) => {
          const owned = character.ownedActions.includes(a.id)
          const canBuy = a.currency === 'coins' ? character.coins >= (a.priceCoins ?? 0) : a.currency === 'sparks' ? character.sparks >= (a.priceSparks ?? 0) : true
          return (
            <div key={a.id} className="pixel-panel p-3 flex items-center gap-3">
              <div className="text-2xl">{a.icon}</div>
              <div className="flex-1">
                <div className="text-[#f3e9d2] font-semibold">{a.label}</div>
                <div className="text-xs text-[#d8c9a8]">{RARITY_LABEL[a.rarity]} · {a.effect}</div>
              </div>
              {owned ? (
                <span className="text-xs text-[#4ade80]">Получено</span>
              ) : a.currency === 'free' ? (
                <span className="text-xs text-[#d8c9a8]">Бесплатно</span>
              ) : a.rarity === 'event' ? (
                <span className="text-xs text-[#a78bfa]">Награда за ивент</span>
              ) : (
                <button
                  disabled={!canBuy}
                  onClick={() => dispatch({ type: 'BUY_ACTION', player, actionId: a.id })}
                  className="pixel-btn bg-[#3f7d3a] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5"
                >
                  {a.currency === 'coins' ? `${a.priceCoins} монет` : `${a.priceSparks} искр`}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </ModalShell>
  )
}
