import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { FOCUS_PRESETS, formatMinutes } from '../data/focus'
import type { PlayerId, Task } from '../types'

function useTick(active: boolean) {
  const [, force] = useState(0)
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => force((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [active])
}

export function FocusControls({ task }: { task: Task }) {
  const { state, dispatch } = useStore()
  const me = state.currentPlayer as PlayerId
  const character = state.characters[me]
  const active = character.activeFocus
  const isThisTask = active?.taskId === task.id
  const [picking, setPicking] = useState(false)
  const [custom, setCustom] = useState(30)
  const [confirmSwitch, setConfirmSwitch] = useState<number | null>(null)

  useTick(isThisTask)

  const canFocus = task.status !== 'done' && (task.assignee === me || task.assignee === 'both')
  if (!canFocus) return null

  const mySessions = state.focusSessions.filter((s) => s.taskId === task.id && s.player === me)
  const totalMinutes = mySessions.reduce((sum, s) => sum + s.minutes, 0)

  const startFocus = (minutes: number) => {
    if (active && active.taskId !== task.id) {
      setConfirmSwitch(minutes)
      return
    }
    dispatch({ type: 'START_FOCUS', player: me, taskId: task.id, minutes })
    setPicking(false)
  }

  if (isThisTask && active) {
    const elapsedMs = Date.now() - new Date(active.startedAt).getTime()
    const elapsedMin = Math.floor(elapsedMs / 60000)
    const elapsedSec = Math.floor((elapsedMs % 60000) / 1000)
    const plannedMs = active.plannedMinutes * 60000
    const over = elapsedMs > plannedMs

    return (
      <div className="pixel-panel p-2.5 border border-[#facc15]/40">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-[#facc15] font-bold">🎯 Фокус</span>
          <span className={over ? 'text-[#4ade80]' : 'text-[#eef3f6]'}>
            {elapsedMin} мин {elapsedSec.toString().padStart(2, '0')} сек {over ? '(время истекло, можно продолжать)' : `/ ${active.plannedMinutes} мин`}
          </span>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => dispatch({ type: 'PAUSE_FOCUS', player: me })} className="pixel-btn bg-[#243544] text-[#eef3f6] text-xs px-2.5 py-1.5">⏸ Пауза</button>
          <button onClick={() => dispatch({ type: 'STOP_FOCUS', player: me })} className="pixel-btn bg-[#243544] text-[#eef3f6] text-xs px-2.5 py-1.5">Завершить сессию</button>
          <button onClick={() => dispatch({ type: 'COMPLETE_TASK', id: task.id, player: me })} className="pixel-btn bg-[#2fae7a] text-white text-xs px-2.5 py-1.5">Завершить задачу</button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-xs text-[#9fb2bf]">
      {totalMinutes > 0 && <div className="mb-1">Затрачено времени: {formatMinutes(totalMinutes)} · сессий: {mySessions.length}</div>}
      {!picking ? (
        <button onClick={() => setPicking(true)} className="pixel-btn bg-[#243544] text-[#eef3f6] text-xs px-2.5 py-1.5">🎯 Начать фокус</button>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5">
          {FOCUS_PRESETS.map((m) => (
            <button key={m} onClick={() => startFocus(m)} className="pixel-btn bg-[#243544] text-[#eef3f6] text-xs px-2 py-1">{m} мин</button>
          ))}
          <input type="number" min={1} value={custom} onChange={(e) => setCustom(Number(e.target.value))} className="w-14 pixel-slot px-1.5 py-1 text-xs text-[#eef3f6] outline-none" />
          <button onClick={() => startFocus(custom)} className="pixel-btn bg-[#2fae7a] text-white text-xs px-2 py-1">Старт</button>
          <button onClick={() => setPicking(false)} className="text-[#9fb2bf] px-1">×</button>
        </div>
      )}

      {confirmSwitch !== null && (
        <div className="pixel-panel p-2 mt-1.5">
          <div className="mb-1.5">Переключиться на другую задачу? Текущая сессия сохранится.</div>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                dispatch({ type: 'START_FOCUS', player: me, taskId: task.id, minutes: confirmSwitch })
                setConfirmSwitch(null)
                setPicking(false)
              }}
              className="pixel-btn bg-[#2fae7a] text-white text-xs px-2.5 py-1"
            >
              Да, переключиться
            </button>
            <button onClick={() => setConfirmSwitch(null)} className="pixel-btn bg-[#243544] text-[#eef3f6] text-xs px-2.5 py-1">Отмена</button>
          </div>
        </div>
      )}
    </div>
  )
}
