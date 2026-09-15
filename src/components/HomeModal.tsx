import { ModalShell } from './ModalShell'
import { useStore, allShopItems } from '../store'
import { CharacterSprite } from './CharacterSprite'
import { XpBar } from './XpBar'
import type { PlayerId } from '../types'

export function HomeModal({ target, onClose, onEditAppearance }: { target: PlayerId; onClose: () => void; onEditAppearance: () => void }) {
  const { state } = useStore()
  const me = state.currentPlayer as PlayerId
  const character = state.characters[target]
  const isMine = target === me
  const items = allShopItems(state)
  const furniture = character.homeFurniture.map((id) => items.find((i) => i.id === id)).filter(Boolean)
  const done = state.tasks.filter((t) => (t.assignee === target || t.assignee === 'both') && t.status === 'done').length
  const active = state.tasks.filter((t) => (t.assignee === target || t.assignee === 'both') && t.status !== 'done').length

  return (
    <ModalShell title={`Дом · ${character.name}`} onClose={onClose} wide>
      <div className="flex flex-col items-center gap-3">
        <CharacterSprite appearance={character.appearance} size={64} />
        {isMine && (
          <div className="w-full">
            <XpBar xp={character.xp} coins={character.coins} sparks={character.sparks} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 w-full text-center">
          <div className="pixel-panel p-2">
            <div className="text-lg font-bold text-[#f3e9d2]">{done}</div>
            <div className="text-xs text-[#d8c9a8]">Выполнено</div>
          </div>
          <div className="pixel-panel p-2">
            <div className="text-lg font-bold text-[#f3e9d2]">{active}</div>
            <div className="text-xs text-[#d8c9a8]">Активно</div>
          </div>
        </div>

        <div className="w-full">
          <div className="text-sm text-[#d8c9a8] mb-1.5">Убранство дома</div>
          <div className="grid grid-cols-5 gap-1.5">
            {furniture.map((f) => (
              <div key={f!.id} className="pixel-slot aspect-square flex items-center justify-center" title={f!.name}>
                <div className="w-6 h-6" style={{ background: f!.color, border: '2px solid #1f150d' }} />
              </div>
            ))}
            {furniture.length === 0 && <div className="col-span-5 text-xs text-[#d8c9a8]">Пусто — купи мебель в Лавке</div>}
          </div>
        </div>

        {isMine && (
          <button onClick={onEditAppearance} className="pixel-btn w-full py-2 bg-[#4a3826] text-[#f3e9d2] text-sm">Изменить внешность</button>
        )}
      </div>
    </ModalShell>
  )
}
