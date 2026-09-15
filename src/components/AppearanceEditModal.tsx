import { ModalShell } from './ModalShell'
import { useStore } from '../store'
import { CharacterSprite } from './CharacterSprite'

const SKIN_TONES = ['#f2c9a1', '#e0ac69', '#c68642', '#8d5524', '#ffe0bd']
const HAIR_COLORS = ['#4a3728', '#1c1c1c', '#a05a2c', '#e8c179', '#7a3b3b']
const OUTFIT_COLORS = ['#94a3b8', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444']
const SHOES_COLORS = ['#3f3f46', '#78350f', '#1e293b', '#7f1d1d']

function Swatch({ color, active, onClick }: { color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 border-2"
      style={{ background: color, borderColor: active ? '#f3e9d2' : '#1f150d' }}
    />
  )
}

export function AppearanceEditModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore()
  const player = state.currentPlayer!
  const character = state.characters[player]
  const a = character.appearance
  const setAppearance = (patch: Partial<typeof a>) => dispatch({ type: 'SET_APPEARANCE', player, appearance: patch })

  return (
    <ModalShell title="Изменить внешность" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex justify-center">
          <CharacterSprite appearance={a} size={64} />
        </div>
        <div>
          <label className="text-xs text-[#d8c9a8] block mb-1.5">Цвет кожи</label>
          <div className="flex gap-2">
            {SKIN_TONES.map((c) => (
              <Swatch key={c} color={c} active={a.skinColor === c} onClick={() => setAppearance({ skinColor: c })} />
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-[#d8c9a8] block mb-1.5">Волосы</label>
          <div className="flex gap-2">
            {HAIR_COLORS.map((c) => (
              <Swatch key={c} color={c} active={a.hairColor === c} onClick={() => setAppearance({ hairColor: c })} />
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-[#d8c9a8] block mb-1.5">Одежда</label>
          <div className="flex gap-2 flex-wrap">
            {OUTFIT_COLORS.map((c) => (
              <Swatch key={c} color={c} active={a.outfitColor === c} onClick={() => setAppearance({ outfitColor: c })} />
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-[#d8c9a8] block mb-1.5">Обувь</label>
          <div className="flex gap-2">
            {SHOES_COLORS.map((c) => (
              <Swatch key={c} color={c} active={a.shoesColor === c} onClick={() => setAppearance({ shoesColor: c })} />
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  )
}
