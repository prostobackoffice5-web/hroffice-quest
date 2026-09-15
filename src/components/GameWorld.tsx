import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { GRID_COLS, GRID_ROWS, TILE, WORLD_OBJECTS, nearbyInteractive } from '../data/world'
import { GrassTile, WorldObjectView } from './WorldTile'
import { CharacterSprite } from './CharacterSprite'
import { XpBar } from './XpBar'
import { BoardModal } from './BoardModal'
import { ComputerModal } from './ComputerModal'
import { InventoryModal } from './InventoryModal'
import { ShopModal } from './ShopModal'
import { CharacterSheetModal } from './CharacterSheetModal'
import { AppearanceEditModal } from './AppearanceEditModal'
import { AchievementsModal } from './AchievementsModal'
import { SettingsModal } from './SettingsModal'

type ModalKind = 'board' | 'computer' | 'chest' | 'shop' | 'bed' | 'bookshelf' | 'settings' | 'appearance' | null

const KIND_TO_MODAL: Record<string, ModalKind> = {
  board: 'board',
  computer: 'computer',
  chest: 'chest',
  shop: 'shop',
  bed: 'bed',
  bookshelf: 'bookshelf',
}

export function GameWorld() {
  const { state, dispatch } = useStore()
  const player = state.currentPlayer!
  const character = state.characters[player]
  const [modal, setModal] = useState<ModalKind>(null)

  const nearby = nearbyInteractive(character.position.x, character.position.y)

  const interact = () => {
    if (!nearby) return
    setModal(KIND_TO_MODAL[nearby.kind] ?? null)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modal) return
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
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') interact()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const move = (dx: number, dy: number) => {
    if (modal) return
    dispatch({ type: 'MOVE', player, dx, dy })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-3" style={{ background: '#0e1a10' }}>
      <div className="pixel-window w-full" style={{ maxWidth: GRID_COLS * TILE }}>
        <div className="pixel-window-title">
          <span>{character.name}</span>
          <button onClick={() => setModal('settings')} className="pixel-btn-x" title="Настройки">⚙</button>
        </div>
        <div className="p-3">
          <XpBar xp={character.xp} coins={character.coins} />
        </div>
      </div>

      <div
        className="relative"
        style={{ width: GRID_COLS * TILE, height: GRID_ROWS * TILE, maxWidth: '100%', overflow: 'hidden', border: '4px solid #1f150d' }}
      >
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

        <div
          className="absolute transition-all duration-150 flex items-center justify-center"
          style={{ left: character.position.x * TILE, top: character.position.y * TILE, width: TILE, height: TILE }}
        >
          <CharacterSprite appearance={character.appearance} size={36} />
        </div>

        {nearby && !modal && (
          <div
            className="absolute pixel-window px-3 py-1.5 text-xs"
            style={{ left: nearby.x * TILE, top: nearby.y * TILE - 34 }}
          >
            {nearby.label} · Нажмите [E]
          </div>
        )}
      </div>

      {/* controls */}
      <div className="flex items-center gap-6 select-none">
        <div className="grid grid-cols-3 gap-1 w-32">
          <div />
          <button className="pixel-btn bg-[#4a3826] text-[#f3e9d2] py-2" onClick={() => move(0, -1)}>▲</button>
          <div />
          <button className="pixel-btn bg-[#4a3826] text-[#f3e9d2] py-2" onClick={() => move(-1, 0)}>◀</button>
          <div />
          <button className="pixel-btn bg-[#4a3826] text-[#f3e9d2] py-2" onClick={() => move(1, 0)}>▶</button>
          <div />
          <button className="pixel-btn bg-[#4a3826] text-[#f3e9d2] py-2" onClick={() => move(0, 1)}>▼</button>
          <div />
        </div>
        <button
          disabled={!nearby}
          onClick={interact}
          className="pixel-btn bg-[#3f7d3a] disabled:opacity-30 disabled:cursor-not-allowed text-white px-5 py-3 text-sm font-bold"
        >
          Взаимодействовать
        </button>
      </div>

      {modal === 'board' && <BoardModal onClose={() => setModal(null)} />}
      {modal === 'computer' && <ComputerModal onClose={() => setModal(null)} />}
      {modal === 'chest' && <InventoryModal onClose={() => setModal(null)} />}
      {modal === 'shop' && <ShopModal onClose={() => setModal(null)} />}
      {modal === 'bed' && <CharacterSheetModal onClose={() => setModal(null)} onEditAppearance={() => setModal('appearance')} />}
      {modal === 'appearance' && <AppearanceEditModal onClose={() => setModal('bed')} />}
      {modal === 'bookshelf' && <AchievementsModal onClose={() => setModal(null)} />}
      {modal === 'settings' && <SettingsModal onClose={() => setModal(null)} />}
    </div>
  )
}
