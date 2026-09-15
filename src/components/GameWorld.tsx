import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { GRID_COLS, GRID_ROWS, TILE, WORLD_OBJECTS, nearbyInteractive } from '../data/world'
import { GrassTile, WorldObjectView } from './WorldTile'
import { CharacterSprite } from './CharacterSprite'
import { XpBar } from './XpBar'
import { BoardModal } from './BoardModal'
import { BoardDock } from './BoardDock'
import { ActionsModal } from './ActionsModal'
import { InventoryModal } from './InventoryModal'
import { ShopModal } from './ShopModal'
import { HomeModal } from './HomeModal'
import { AppearanceEditModal } from './AppearanceEditModal'
import { AchievementsModal } from './AchievementsModal'
import { SettingsModal } from './SettingsModal'
import { MailModal } from './MailModal'
import { ActionWheel } from './ActionWheel'
import { WorldEventFx } from './WorldEventFx'
import { NotificationStack } from './NotificationStack'
import { WelcomeBackModal } from './WelcomeBackModal'
import { DailyChestButton } from './DailyChestButton'
import { Garden } from './Garden'
import type { Character, PlayerId } from '../types'

type ModalKind = 'board' | 'actions' | 'chest' | 'shop' | 'home' | 'bookshelf' | 'mail' | 'settings' | 'appearance' | null

function presenceDot(character: Character) {
  if (character.activeFocus) return '#facc15'
  if (character.resting) return '#38bdf8'
  return '#4ade80'
}

export function GameWorld() {
  const { state, dispatch } = useStore()
  const player = state.currentPlayer!
  const character = state.characters[player]
  const other = state.characters[player === 'arai' ? 'linara' : 'arai']
  const [modal, setModal] = useState<ModalKind>(null)
  const [homeTarget, setHomeTarget] = useState<PlayerId>(player)
  const [wheelTarget, setWheelTarget] = useState<PlayerId | null>(null)

  const nearby = nearbyInteractive(character.position.x, character.position.y)
  const nearOther = Math.abs(other.position.x - character.position.x) + Math.abs(other.position.y - character.position.y) === 1

  const interact = () => {
    if (!nearby) return
    if (nearby.kind === 'bed') setHomeTarget(nearby.id === 'bed-arai' ? 'arai' : 'linara')
    const map: Record<string, ModalKind> = { board: 'board', computer: 'actions', chest: 'chest', shop: 'shop', bed: 'home', bookshelf: 'bookshelf', mail: 'mail' }
    setModal(map[nearby.kind] ?? null)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modal || wheelTarget) return
      const map: Record<string, [number, number]> = {
        ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
        ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
        ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
        ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
      }
      if (map[e.key]) {
        const [dx, dy] = map[e.key]
        dispatch({ type: 'MOVE', player, dx, dy })
      }
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        if (nearOther) setWheelTarget(other.id)
        else interact()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const move = (dx: number, dy: number) => {
    if (modal || wheelTarget) return
    dispatch({ type: 'MOVE', player, dx, dy })
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-4 p-4" style={{ background: '#0b1117' }}>
      <NotificationStack />
      <WelcomeBackModal />

      <div className="flex-1 flex flex-col items-center gap-3 min-w-0">
        <div className="pixel-window w-full" style={{ maxWidth: GRID_COLS * TILE }}>
          <div className="pixel-window-title">
            <span>{character.name}</span>
            <div className="flex items-center gap-2">
              <DailyChestButton />
              <button onClick={() => setModal('settings')} className="pixel-btn-x" title="Настройки">⚙</button>
            </div>
          </div>
          <div className="p-3">
            <XpBar xp={character.xp} coins={character.coins} sparks={character.sparks} />
          </div>
        </div>

        <div className="relative w-full" style={{ maxWidth: GRID_COLS * TILE }}>
          <div className="relative mx-auto" style={{ width: GRID_COLS * TILE, height: GRID_ROWS * TILE, maxWidth: '100%', overflow: 'hidden', border: '4px solid #12181f' }}>
            <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, ${TILE}px)`, gridTemplateRows: `repeat(${GRID_ROWS}, ${TILE}px)` }}>
              {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => (
                <GrassTile key={i} />
              ))}
            </div>

            {WORLD_OBJECTS.map((o) => (
              <div
                key={o.id}
                onClick={() => nearby?.id === o.id && interact()}
                className="absolute flex items-center justify-center"
                style={{ left: o.x * TILE, top: o.y * TILE, width: TILE, height: TILE, cursor: o.interactive ? 'pointer' : 'default' }}
              >
                <WorldObjectView kind={o.kind} label={o.label} />
              </div>
            ))}

            <Garden player="arai" x={2} y={6} />
            <Garden player="linara" x={4} y={6} />

            <div
              className="absolute transition-all duration-150 flex items-center justify-center"
              style={{ left: other.position.x * TILE, top: other.position.y * TILE, width: TILE, height: TILE, cursor: nearOther ? 'pointer' : 'default' }}
              onClick={() => nearOther && setWheelTarget(other.id)}
            >
              <CharacterSprite appearance={other.appearance} size={42} />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#12181f]" style={{ background: presenceDot(other) }} />
            </div>

            <div
              className="absolute transition-all duration-150 flex items-center justify-center"
              style={{ left: character.position.x * TILE, top: character.position.y * TILE, width: TILE, height: TILE }}
            >
              <CharacterSprite appearance={character.appearance} size={44} />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#12181f]" style={{ background: presenceDot(character) }} />
            </div>

            <WorldEventFx />

            {nearOther && !modal && (
              <div className="absolute pixel-window px-3 py-1.5 text-xs" style={{ left: other.position.x * TILE, top: other.position.y * TILE - 34 }}>
                {other.name} · Нажмите [E]
              </div>
            )}
            {nearby && !modal && !nearOther && (
              <div className="absolute pixel-window px-3 py-1.5 text-xs" style={{ left: nearby.x * TILE, top: nearby.y * TILE - 34 }}>
                {nearby.label} · Нажмите [E]
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 select-none">
          <div className="grid grid-cols-3 gap-1 w-32">
            <div />
            <button className="pixel-btn bg-[#243544] text-[#eef3f6] py-2" onClick={() => move(0, -1)}>▲</button>
            <div />
            <button className="pixel-btn bg-[#243544] text-[#eef3f6] py-2" onClick={() => move(-1, 0)}>◀</button>
            <div />
            <button className="pixel-btn bg-[#243544] text-[#eef3f6] py-2" onClick={() => move(1, 0)}>▶</button>
            <div />
            <button className="pixel-btn bg-[#243544] text-[#eef3f6] py-2" onClick={() => move(0, 1)}>▼</button>
            <div />
          </div>
          <button
            disabled={!nearby && !nearOther}
            onClick={() => (nearOther ? setWheelTarget(other.id) : interact())}
            className="pixel-btn bg-[#2fae7a] disabled:opacity-30 disabled:cursor-not-allowed text-white px-5 py-3 text-sm font-bold"
          >
            Взаимодействовать
          </button>
        </div>
      </div>

      <aside className="w-full lg:w-[400px] shrink-0">
        <BoardDock onOpenFull={() => setModal('board')} />
      </aside>

      {modal === 'board' && <BoardModal onClose={() => setModal(null)} />}
      {modal === 'actions' && <ActionsModal onClose={() => setModal(null)} />}
      {modal === 'chest' && <InventoryModal onClose={() => setModal(null)} />}
      {modal === 'shop' && <ShopModal onClose={() => setModal(null)} />}
      {modal === 'home' && <HomeModal target={homeTarget} onClose={() => setModal(null)} onEditAppearance={() => setModal('appearance')} />}
      {modal === 'appearance' && <AppearanceEditModal onClose={() => setModal('home')} />}
      {modal === 'bookshelf' && <AchievementsModal onClose={() => setModal(null)} />}
      {modal === 'mail' && <MailModal onClose={() => setModal(null)} />}
      {modal === 'settings' && <SettingsModal onClose={() => setModal(null)} />}
      {wheelTarget && <ActionWheel target={wheelTarget} onClose={() => setWheelTarget(null)} />}
    </div>
  )
}
