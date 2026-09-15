import { ModalShell } from './ModalShell'
import { useStore } from '../store'

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useStore()

  return (
    <ModalShell title="Настройки" onClose={onClose}>
      <div className="space-y-3">
        <button
          onClick={() => {
            dispatch({ type: 'LOGOUT' })
            onClose()
          }}
          className="pixel-btn w-full py-2.5 bg-[#4a3826] text-[#f3e9d2]"
        >
          Сменить игрока
        </button>
      </div>
    </ModalShell>
  )
}
