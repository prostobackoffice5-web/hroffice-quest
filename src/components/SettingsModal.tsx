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
          className="pixel-btn w-full py-2.5 bg-[#243544] text-[#eef3f6]"
        >
          Сменить игрока
        </button>
      </div>
    </ModalShell>
  )
}
