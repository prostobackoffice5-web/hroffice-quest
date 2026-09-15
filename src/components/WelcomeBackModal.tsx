import { ModalShell } from './ModalShell'
import { useStore } from '../store'

export function WelcomeBackModal() {
  const { state, dispatch } = useStore()
  const digest = state.welcomeBack
  if (!digest) return null

  return (
    <ModalShell title="Пока тебя не было..." onClose={() => dispatch({ type: 'CLEAR_WELCOME_BACK' })}>
      <div className="space-y-2">
        {digest.lines.map((line, i) => (
          <div key={i} className="pixel-panel p-2.5 text-sm text-[#eef3f6]">✨ {line}</div>
        ))}
      </div>
      <button onClick={() => dispatch({ type: 'CLEAR_WELCOME_BACK' })} className="pixel-btn w-full py-2 bg-[#2fae7a] text-white text-sm mt-3">
        Понятно
      </button>
    </ModalShell>
  )
}
