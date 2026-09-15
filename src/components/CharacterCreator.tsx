import { useStore } from '../store'
import { CharacterPanel } from './CharacterPanel'
import { levelFromXp, unlockedTitles } from '../data/engine'

const EMOJIS = ['🧑', '👩', '👨', '🧕', '👱', '🧑‍💻', '🧑‍🎨', '🧑‍🔬']
const OUTFIT_COLORS = ['#f59e0b', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444']
const HAIR_COLORS = ['#4a3728', '#1c1c1c', '#a05a2c', '#e8c179', '#7a3b3b']
const SKIN_TONES = ['#f2c9a1', '#e0ac69', '#c68642', '#8d5524', '#ffe0bd']
const ACCESSORIES = ['none', 'glasses', 'earrings', 'headphones', 'backpack']
const ACCESSORY_LABEL: Record<string, string> = {
  none: '—', glasses: '👓', earrings: '💎', headphones: '🎧', backpack: '🎒',
}

function Swatch({ color, active, onClick }: { color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-7 h-7 rounded-full border-2 ${active ? 'border-white' : 'border-transparent'}`}
      style={{ background: color }}
    />
  )
}

export function CharacterCreator() {
  const { state, dispatch } = useStore()
  const player = state.currentPlayer
  const character = state.characters[player]
  const a = character.appearance

  const setAppearance = (patch: Partial<typeof a>) => dispatch({ type: 'SET_APPEARANCE', player, appearance: patch })

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">Character Creator — {character.name}</h2>
      <CharacterPanel character={character} />

      <div className="pixel-border bg-[#241a40] p-4 space-y-4">
        <div>
          <label className="text-xs text-purple-300">Имя</label>
          <input
            value={character.name}
            onChange={(e) => dispatch({ type: 'SET_CHARACTER_NAME', player, name: e.target.value })}
            className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-purple-300 block mb-1.5">Аватар</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setAppearance({ emoji: e })}
                className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg border-2 ${a.emoji === e ? 'border-fuchsia-400 bg-white/10' : 'border-transparent bg-white/5'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-purple-300 block mb-1.5">Цвет одежды</label>
          <div className="flex gap-2">
            {OUTFIT_COLORS.map((c) => (
              <Swatch key={c} color={c} active={a.outfitColor === c} onClick={() => setAppearance({ outfitColor: c })} />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-purple-300 block mb-1.5">Цвет волос</label>
          <div className="flex gap-2">
            {HAIR_COLORS.map((c) => (
              <Swatch key={c} color={c} active={a.hairColor === c} onClick={() => setAppearance({ hairColor: c })} />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-purple-300 block mb-1.5">Цвет кожи</label>
          <div className="flex gap-2">
            {SKIN_TONES.map((c) => (
              <Swatch key={c} color={c} active={a.skinColor === c} onClick={() => setAppearance({ skinColor: c })} />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-purple-300 block mb-1.5">Титул</label>
          <div className="flex flex-wrap gap-2">
            {unlockedTitles(levelFromXp(character.xp)).map((t) => (
              <button
                key={t}
                onClick={() => dispatch({ type: 'SET_TITLE', player, title: t })}
                className={`px-3 py-1.5 rounded-lg text-sm border-2 ${character.title === t ? 'border-fuchsia-400 bg-white/10 text-white' : 'border-transparent bg-white/5 text-purple-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-purple-300 block mb-1.5">Аксессуар</label>
          <div className="flex gap-2">
            {ACCESSORIES.map((acc) => (
              <button
                key={acc}
                onClick={() => setAppearance({ accessory: acc })}
                className={`px-3 py-1.5 rounded-lg text-sm border-2 ${a.accessory === acc ? 'border-fuchsia-400 bg-white/10 text-white' : 'border-transparent bg-white/5 text-purple-200'}`}
              >
                {ACCESSORY_LABEL[acc]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
