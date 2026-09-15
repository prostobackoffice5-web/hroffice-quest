import { useMemo, useState } from 'react'
import { ModalShell } from './ModalShell'
import { useStore, allShopItems } from '../store'
import { SHOP_CATEGORY_LABELS, RARITY_LABELS, RARITY_COLORS } from '../data/shopItems'
import { ItemIcon } from './ItemIcon'
import type { Rarity, ShopCategory } from '../types'

export function ShopModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore()
  const player = state.currentPlayer!
  const character = state.characters[player]
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ShopCategory | 'all'>('all')
  const [rarity, setRarity] = useState<Rarity | 'all'>('all')

  const items = useMemo(() => {
    return allShopItems(state)
      .filter((i) => (category === 'all' ? true : i.category === category))
      .filter((i) => (rarity === 'all' ? true : i.rarity === rarity))
      .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
  }, [state, category, rarity, search])

  return (
    <ModalShell title="Лавка" onClose={onClose} wide>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск предметов..." className="pixel-slot px-3 py-1.5 text-sm text-[#eef3f6] outline-none flex-1 min-w-[160px]" />
        <div className="text-sm text-[#facc15]">Монет: {character.coins}</div>
        <div className="text-sm text-[#a78bfa]">Искры: {character.sparks}</div>
      </div>

      <div className="flex gap-1 mb-2 flex-wrap">
        <button onClick={() => setCategory('all')} className={`pixel-btn text-xs px-2.5 py-1.5 ${category === 'all' ? 'bg-[#31485a] text-white' : 'bg-[#243544] text-[#9fb2bf]'}`}>Все</button>
        {(Object.keys(SHOP_CATEGORY_LABELS) as ShopCategory[]).map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`pixel-btn text-xs px-2.5 py-1.5 ${category === c ? 'bg-[#31485a] text-white' : 'bg-[#243544] text-[#9fb2bf]'}`}>
            {SHOP_CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>
      <div className="flex gap-1 mb-3 flex-wrap">
        <button onClick={() => setRarity('all')} className={`pixel-btn text-xs px-2.5 py-1 ${rarity === 'all' ? 'bg-[#31485a] text-white' : 'bg-[#243544] text-[#9fb2bf]'}`}>Любая редкость</button>
        {(Object.keys(RARITY_LABELS) as Rarity[]).map((r) => (
          <button key={r} onClick={() => setRarity(r)} className="pixel-btn text-xs px-2.5 py-1" style={{ background: rarity === r ? RARITY_COLORS[r] : '#243544', color: rarity === r ? '#12181f' : '#9fb2bf' }}>
            {RARITY_LABELS[r]}
          </button>
        ))}
      </div>

      <div className="text-xs text-[#9fb2bf] mb-2">Найдено предметов: {items.length}</div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[50vh] overflow-y-auto pr-1">
        {items.map((item) => {
          const owned = character.inventory.some((i) => i.itemId === item.id)
          const isEvent = !!item.eventId
          const canBuy =
            item.currency === 'coins' ? character.coins >= (item.priceCoins ?? 0) :
            item.currency === 'sparks' ? character.sparks >= (item.priceSparks ?? 0) :
            character.coins >= (item.priceCoins ?? 0) && character.sparks >= (item.priceSparks ?? 0)
          return (
            <div
              key={item.id}
              title={`${item.name}\n${RARITY_LABELS[item.rarity]}\n${item.description}`}
              className="pixel-slot p-2 flex flex-col items-center gap-1.5"
              style={{ boxShadow: `inset 0 0 0 2px ${RARITY_COLORS[item.rarity]}` }}
            >
              <ItemIcon name={item.name} color={item.color} size={40} />
              <span className="text-[10px] text-[#eef3f6] text-center leading-tight">{item.name}</span>
              <span className="text-[10px]" style={{ color: RARITY_COLORS[item.rarity] }}>{RARITY_LABELS[item.rarity]}</span>
              {owned ? (
                <span className="text-[10px] text-[#4ade80]">Куплено</span>
              ) : isEvent ? (
                <span className="text-[10px] text-[#a78bfa] text-center">Только за ивент</span>
              ) : (
                <>
                  <span className="text-[10px] text-[#facc15] text-center">
                    {item.currency === 'coins' && `${item.priceCoins} монет`}
                    {item.currency === 'sparks' && `${item.priceSparks} искр`}
                    {item.currency === 'combo' && `${item.priceCoins}м + ${item.priceSparks}и`}
                  </span>
                  <button
                    disabled={!canBuy}
                    onClick={() => dispatch({ type: 'BUY_ITEM', player, itemId: item.id })}
                    className="pixel-btn bg-[#2fae7a] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[10px] px-2 py-1"
                  >
                    Купить
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>
    </ModalShell>
  )
}
