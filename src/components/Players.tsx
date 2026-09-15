import { useState } from 'react'
import { useStore } from '../store'
import { CharacterPanel } from './CharacterPanel'
import type { PlayerId } from '../types'

export function Players() {
  const { state, dispatch } = useStore()
  const order: PlayerId[] = ['arai', 'linara']
  const [giftFor, setGiftFor] = useState<PlayerId | null>(null)
  const [giftAmount, setGiftAmount] = useState(50)

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">👥 PLAYERS</h2>
      {order.map((id) => {
        const character = state.characters[id]
        const quests = state.quests.filter((q) => q.assignee === id || q.assignee === 'both')
        const done = quests.filter((q) => q.status === 'done').length
        const other = id !== state.currentPlayer

        return (
          <div key={id} className="space-y-2">
            <CharacterPanel character={character} />
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="pixel-border bg-[#241a40] p-3">
                <div className="text-lg font-bold text-white">{done}</div>
                <div className="text-xs text-purple-300">завершено</div>
              </div>
              <div className="pixel-border bg-[#241a40] p-3">
                <div className="text-lg font-bold text-white">{quests.length - done}</div>
                <div className="text-xs text-purple-300">активно</div>
              </div>
              <div className="pixel-border bg-[#241a40] p-3">
                <div className="text-lg font-bold text-white">⭐ {character.reputation}</div>
                <div className="text-xs text-purple-300">reputation</div>
              </div>
            </div>

            {other && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch({ type: 'SEND_PRAISE', from: state.currentPlayer, to: id })}
                  className="rounded-lg bg-white/10 hover:bg-white/20 text-purple-100 text-xs font-semibold px-3 py-1.5"
                >
                  🎉 Great job!
                </button>
                <button
                  onClick={() => setGiftFor(giftFor === id ? null : id)}
                  className="rounded-lg bg-white/10 hover:bg-white/20 text-purple-100 text-xs font-semibold px-3 py-1.5"
                >
                  🎁 Подарить
                </button>
                <button
                  onClick={() => dispatch({ type: 'SWITCH_PLAYER', player: id })}
                  className="text-sm text-fuchsia-300 hover:text-fuchsia-200 ml-auto"
                >
                  Открыть профиль →
                </button>
              </div>
            )}
            {other && giftFor === id && (
              <div className="flex items-center gap-2 pixel-border bg-[#241a40] p-2">
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(Number(e.target.value))}
                  className="w-24 rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white outline-none"
                />
                <span className="text-purple-300 text-sm">🪙</span>
                <button
                  onClick={() => {
                    dispatch({ type: 'SEND_GIFT', from: state.currentPlayer, to: id, coins: giftAmount })
                    setGiftFor(null)
                  }}
                  className="rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-xs font-semibold px-3 py-1.5"
                >
                  Отправить
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
