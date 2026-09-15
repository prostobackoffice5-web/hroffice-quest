import { useStore } from '../store'
import { NPCS, SHOP_ITEMS } from '../data/gamedata'

const SLOTS = 6

export function Room() {
  const { state } = useStore()
  const character = state.characters[state.currentPlayer]
  const furniture = character.inventory
    .map((i) => SHOP_ITEMS.find((s) => s.id === i.itemId))
    .filter((i) => i && i.slot === 'furniture')

  const slots: (string | null)[] = furniture.slice(0, SLOTS).map((f) => f!.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">🏠 ROOM · {character.name}</h2>
        <div className="text-sm text-purple-300">🌍 World Level {state.worldLevel}</div>
      </div>

      <div className="pixel-border bg-linear-to-br from-[#2a2050] to-[#1b1230] p-6">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: SLOTS }).map((_, idx) => {
            const itemId = slots[idx]
            const item = itemId ? SHOP_ITEMS.find((s) => s.id === itemId) : null
            return (
              <div key={idx} className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-3xl bg-white/5">
                {item ? item.icon : <span className="text-white/10 text-xs">empty</span>}
              </div>
            )
          })}
        </div>
        <div className="flex justify-center mt-6 text-5xl">{character.appearance.emoji}</div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-2">Мебель в инвентаре</h3>
        <div className="flex flex-wrap gap-2">
          {furniture.length === 0 && <div className="text-purple-300/60 text-sm">Пока нет мебели — купи в Shop</div>}
          {furniture.map((f) => (
            <div key={f!.id} className="pixel-border bg-[#241a40] px-3 py-2 flex items-center gap-2 text-sm text-purple-100">
              <span className="text-xl">{f!.icon}</span> {f!.name}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-2">NPC</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {NPCS.map((npc) => (
            <div key={npc.id} className="pixel-border bg-[#241a40] p-3 flex items-center gap-3">
              <div className="text-2xl">{npc.icon}</div>
              <div>
                <div className="text-white font-medium">{npc.name}</div>
                <div className="text-xs text-purple-300">{npc.line}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
