import { useEffect, useState } from 'react'
import { ModalShell } from './ModalShell'
import { useStore } from '../store'
import type { PlayerId } from '../types'

export function MailModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore()
  const me = state.currentPlayer as PlayerId
  const other: PlayerId = me === 'arai' ? 'linara' : 'arai'
  const [text, setText] = useState('')

  const thread = state.messages
    .filter((m) => (m.from === me && m.to === other) || (m.from === other && m.to === me))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  useEffect(() => {
    dispatch({ type: 'MARK_MESSAGES_READ', player: me })
  }, [me, dispatch])

  const send = () => {
    if (!text.trim()) return
    dispatch({ type: 'SEND_MESSAGE', from: me, to: other, text: text.trim() })
    setText('')
  }

  return (
    <ModalShell title="Почта" onClose={onClose}>
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto mb-3">
        {thread.map((m) => (
          <div key={m.id} className={`pixel-panel p-2 text-sm max-w-[85%] ${m.from === me ? 'self-end bg-[#3f7d3a]' : 'self-start'}`}>
            <div className="text-[10px] text-[#d8c9a8] mb-0.5">{state.characters[m.from].name}</div>
            <div className="text-[#f3e9d2]">{m.text}</div>
          </div>
        ))}
        {thread.length === 0 && <div className="text-sm text-[#d8c9a8]">Сообщений пока нет</div>}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Написать сообщение..."
          className="flex-1 pixel-slot px-3 py-2 outline-none text-[#f3e9d2] text-sm"
        />
        <button onClick={send} className="pixel-btn bg-[#3f7d3a] text-white text-sm px-3 py-2">Отправить</button>
      </div>
    </ModalShell>
  )
}
