import { BoardContent } from './BoardModal'

export function BoardDock({ onOpenFull }: { onOpenFull: () => void }) {
  return (
    <div className="pixel-window w-full flex flex-col" style={{ maxHeight: 'calc(100vh - 32px)' }}>
      <div className="pixel-window-title">
        <span>📋 Общая доска</span>
        <button onClick={onOpenFull} className="text-xs underline text-[#eef3f6] hover:text-[#ffcb47]">Проекты-ивенты →</button>
      </div>
      <div className="p-3 overflow-y-auto">
        <BoardContent compact />
      </div>
    </div>
  )
}
