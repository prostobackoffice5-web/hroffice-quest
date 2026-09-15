import { ModalShell } from './ModalShell'
import { useStore } from '../store'
import { CharacterSprite } from './CharacterSprite'
import { XpBar } from './XpBar'

export function CharacterSheetModal({ onClose, onEditAppearance }: { onClose: () => void; onEditAppearance: () => void }) {
  const { state } = useStore()
  const player = state.currentPlayer!
  const character = state.characters[player]
  const done = state.tasks.filter((t) => t.assignee === player && t.status === 'done').length
  const active = state.tasks.filter((t) => t.assignee === player && t.status === 'active').length

  return (
    <ModalShell title="Персонаж" onClose={onClose}>
      <div className="flex flex-col items-center gap-3">
        <CharacterSprite appearance={character.appearance} size={64} />
        <div className="text-lg font-bold text-[#f3e9d2]">{character.name}</div>
        <div className="w-full">
          <XpBar xp={character.xp} coins={character.coins} />
        </div>
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
        <button onClick={onEditAppearance} className="pixel-btn w-full py-2 bg-[#4a3826] text-[#f3e9d2] text-sm">
          Изменить внешность
        </button>
      </div>
    </ModalShell>
  )
}
