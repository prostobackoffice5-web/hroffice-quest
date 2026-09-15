import { useState } from 'react'
import { useStore } from '../store'
import { CharacterSprite } from './CharacterSprite'
import type { PlayerId } from '../types'

const SKIN_TONES = ['#f2c9a1', '#e0ac69', '#c68642', '#8d5524', '#ffe0bd']
const HAIR_COLORS = ['#4a3728', '#1c1c1c', '#a05a2c', '#e8c179', '#7a3b3b']
const OUTFIT_COLORS = ['#94a3b8', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444']
const SHOES_COLORS = ['#3f3f46', '#78350f', '#1e293b', '#7f1d1d']
const ACCESSORIES = [
  { id: 'none', label: 'Без аксессуара' },
  { id: 'glasses', label: 'Очки' },
  { id: 'hat', label: 'Шляпа' },
  { id: 'cape', label: 'Плащ' },
]

function Swatch({ color, active, onClick }: { color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 border-2"
      style={{ background: color, borderColor: active ? '#eef3f6' : '#12181f' }}
    />
  )
}

export function CharacterCreatorScreen({ player }: { player: PlayerId }) {
  const { state, dispatch } = useStore()
  const character = state.characters[player]
  const [name, setName] = useState(character.name)
  const a = character.appearance

  const setAppearance = (patch: Partial<typeof a>) => dispatch({ type: 'SET_APPEARANCE', player, appearance: patch })

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(circle at center, #1d3b1f 0%, #0e1a10 70%)' }}>
      <div className="pixel-window w-full max-w-md">
        <div className="pixel-window-title"><span>Создание персонажа</span></div>
        <div className="p-4 space-y-4">
          <div className="flex justify-center">
            <CharacterSprite appearance={a} size={72} />
          </div>

          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1">Имя</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pixel-slot px-3 py-2 text-[#eef3f6] outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1.5">Цвет кожи</label>
            <div className="flex gap-2">
              {SKIN_TONES.map((c) => (
                <Swatch key={c} color={c} active={a.skinColor === c} onClick={() => setAppearance({ skinColor: c })} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1.5">Волосы</label>
            <div className="flex gap-2">
              {HAIR_COLORS.map((c) => (
                <Swatch key={c} color={c} active={a.hairColor === c} onClick={() => setAppearance({ hairColor: c })} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1.5">Одежда</label>
            <div className="flex gap-2 flex-wrap">
              {OUTFIT_COLORS.map((c) => (
                <Swatch key={c} color={c} active={a.outfitColor === c} onClick={() => setAppearance({ outfitColor: c })} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1.5">Обувь</label>
            <div className="flex gap-2">
              {SHOES_COLORS.map((c) => (
                <Swatch key={c} color={c} active={a.shoesColor === c} onClick={() => setAppearance({ shoesColor: c })} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-[#9fb2bf] block mb-1.5">Аксессуар</label>
            <div className="flex gap-2 flex-wrap">
              {ACCESSORIES.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setAppearance({ accessory: acc.id })}
                  className={`pixel-btn px-3 py-1.5 text-sm ${a.accessory === acc.id ? 'bg-[#31485a] text-[#fff6e0]' : 'bg-[#243544] text-[#9fb2bf]'}`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => dispatch({ type: 'FINISH_CREATION', player, name: name.trim() || character.name })}
            className="pixel-btn w-full py-2.5 bg-[#2fae7a] text-white"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  )
}
