import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useStore } from '../store'

export function Notifications() {
  const { state, dispatch } = useStore()
  const [open, setOpen] = useState(false)
  const mine = state.notifications.filter((n) => n.player === state.currentPlayer)
  const unread = mine.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o)
          if (!open) dispatch({ type: 'MARK_NOTIFICATIONS_READ', player: state.currentPlayer })
        }}
        className="relative rounded-lg bg-white/5 hover:bg-white/10 p-2 text-purple-200"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto pixel-border bg-[#241a40] p-2 z-50">
          {mine.length === 0 && <div className="text-sm text-purple-300/60 p-3">Пока пусто</div>}
          {mine.map((n) => (
            <div key={n.id} className="flex gap-2 items-start px-2 py-2 text-sm text-purple-100 border-b border-white/5 last:border-0">
              <span>{n.icon}</span>
              <span className="flex-1">{n.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
