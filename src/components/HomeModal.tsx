import { useMemo } from 'react'
import { ModalShell } from './ModalShell'
import { useStore, allShopItems } from '../store'
import { CharacterSprite } from './CharacterSprite'
import { XpBar } from './XpBar'
import { formatMinutes } from '../data/focus'
import type { PlayerId } from '../types'

export function HomeModal({ target, onClose, onEditAppearance }: { target: PlayerId; onClose: () => void; onEditAppearance: () => void }) {
  const { state, dispatch } = useStore()
  const me = state.currentPlayer as PlayerId
  const character = state.characters[target]
  const isMine = target === me
  const items = allShopItems(state)
  const furniture = character.homeFurniture.map((id) => items.find((i) => i.id === id)).filter(Boolean)
  const done = state.tasks.filter((t) => (t.assignee === target || t.assignee === 'both') && t.status === 'done').length
  const active = state.tasks.filter((t) => (t.assignee === target || t.assignee === 'both') && t.status !== 'done').length

  const status = character.activeFocus ? '🟡 Фокус' : character.resting ? '🔵 Отдыхает' : '🟢 Свободна'

  const todayStats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const sessions = state.focusSessions.filter((s) => s.player === target && s.startedAt.slice(0, 10) === today)
    const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0)
    const doneToday = state.tasks.filter((t) => (t.assignee === target || t.assignee === 'both') && t.completedAt?.slice(0, 10) === today).length
    const avg = doneToday > 0 ? Math.round(totalMinutes / doneToday) : 0
    return { totalMinutes, sessions: sessions.length, doneToday, avg }
  }, [state.focusSessions, state.tasks, target])

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of state.focusSessions.filter((s) => s.player === target)) {
      const task = state.tasks.find((t) => t.id === s.taskId)
      if (!task) continue
      map.set(task.categoryId, (map.get(task.categoryId) ?? 0) + s.minutes)
    }
    return Array.from(map.entries())
      .map(([catId, minutes]) => ({ cat: state.categories.find((c) => c.id === catId), minutes }))
      .sort((a, b) => b.minutes - a.minutes)
  }, [state.focusSessions, state.tasks, state.categories, target])

  return (
    <ModalShell title={`Дом · ${character.name}`} onClose={onClose} wide>
      <div className="flex flex-col items-center gap-3">
        <CharacterSprite appearance={character.appearance} size={64} />
        <div className="text-sm text-[#f3e9d2]">{status}</div>
        {isMine && (
          <div className="w-full">
            <XpBar xp={character.xp} coins={character.coins} sparks={character.sparks} />
          </div>
        )}
        {isMine && (
          <button onClick={() => dispatch({ type: 'TOGGLE_RESTING', player: me })} className="pixel-btn w-full py-1.5 bg-[#4a3826] text-[#f3e9d2] text-xs">
            {character.resting ? 'Я снова свободна' : 'Я отдыхаю'}
          </button>
        )}

        <div className="grid grid-cols-2 gap-2 w-full text-center">
          <div className="pixel-panel p-2">
            <div className="text-lg font-bold text-[#f3e9d2]">{done}</div>
            <div className="text-xs text-[#d8c9a8]">Выполнено</div>
          </div>
          <div className="pixel-panel p-2">
            <div className="text-lg font-bold text-[#f3e9d2]">{active}</div>
            <div className="text-xs text-[#d8c9a8]">Активно</div>
          </div>
        </div>

        <div className="w-full pixel-panel p-3">
          <div className="text-sm text-[#facc15] font-semibold mb-1.5">Сегодня</div>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-[#d8c9a8]">
            <div>Время фокуса: <span className="text-[#f3e9d2]">{formatMinutes(todayStats.totalMinutes)}</span></div>
            <div>Сессий: <span className="text-[#f3e9d2]">{todayStats.sessions}</span></div>
            <div>Задач выполнено: <span className="text-[#f3e9d2]">{todayStats.doneToday}</span></div>
            <div>Среднее время: <span className="text-[#f3e9d2]">{formatMinutes(todayStats.avg)}</span></div>
          </div>
        </div>

        {byCategory.length > 0 && (
          <div className="w-full pixel-panel p-3">
            <div className="text-sm text-[#facc15] font-semibold mb-1.5">Время по категориям</div>
            <div className="space-y-1.5">
              {byCategory.map(({ cat, minutes }) => (
                <div key={cat?.id} className="flex items-center gap-2 text-xs">
                  <span className="w-28 text-[#d8c9a8] truncate">{cat?.name}</span>
                  <div className="flex-1 h-2 pixel-slot overflow-hidden"><div className="h-full" style={{ width: `${Math.min(100, (minutes / byCategory[0].minutes) * 100)}%`, background: cat?.color }} /></div>
                  <span className="text-[#f3e9d2] w-16 text-right">{formatMinutes(minutes)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full">
          <div className="text-sm text-[#d8c9a8] mb-1.5">Убранство дома</div>
          <div className="grid grid-cols-5 gap-1.5">
            {furniture.map((f) => (
              <div key={f!.id} className="pixel-slot aspect-square flex items-center justify-center" title={f!.name}>
                <div className="w-6 h-6" style={{ background: f!.color, border: '2px solid #1f150d' }} />
              </div>
            ))}
            {furniture.length === 0 && <div className="col-span-5 text-xs text-[#d8c9a8]">Пусто — купи мебель в Лавке</div>}
          </div>
        </div>

        {isMine && (
          <button onClick={onEditAppearance} className="pixel-btn w-full py-2 bg-[#4a3826] text-[#f3e9d2] text-sm">Изменить внешность</button>
        )}
      </div>
    </ModalShell>
  )
}
