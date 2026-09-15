import { useStore } from '../store'
import { CharacterSprite } from './CharacterSprite'
import type { PlayerId } from '../types'

export function LoginScreen() {
  const { state, dispatch } = useStore()
  const order: PlayerId[] = ['arai', 'linara']

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6" style={{ background: 'radial-gradient(circle at center, #1d3b1f 0%, #0e1a10 70%)' }}>
      <h1 className="text-3xl font-black text-[#f3e9d2] tracking-wide">Кто сегодня играет?</h1>
      <div className="flex flex-wrap gap-6 justify-center">
        {order.map((id) => {
          const character = state.characters[id]
          return (
            <button
              key={id}
              onClick={() => dispatch({ type: 'SELECT_PLAYER', player: id })}
              className="pixel-window w-48 flex flex-col items-center gap-3 py-6 hover:brightness-110 transition"
            >
              <CharacterSprite appearance={character.appearance} size={64} />
              <div className="text-lg font-bold">{character.name}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
