import type { ObjectKind } from '../data/world'
import { TILE } from '../data/world'

function Block({ top, side, children }: { top: string; side: string; children?: React.ReactNode }) {
  return (
    <div
      className="relative"
      style={{ width: TILE * 0.72, height: TILE * 0.72, background: side, border: '2px solid #12181f' }}
    >
      <div style={{ position: 'absolute', top: -6, left: 0, right: 0, height: 8, background: top, border: '2px solid #12181f', borderBottom: 'none' }} />
      {children}
    </div>
  )
}

export function GrassTile() {
  return (
    <div
      className="w-full h-full"
      style={{
        background: 'repeating-linear-gradient(45deg, #4d9c3d 0px, #4d9c3d 8px, #58aa46 8px, #58aa46 16px)',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
      }}
    />
  )
}

export function PathTile() {
  return (
    <div
      className="w-full h-full"
      style={{ background: 'repeating-linear-gradient(45deg,#c2a06b 0px,#c2a06b 8px,#b3925c 8px,#b3925c 16px)' }}
    />
  )
}

export function WaterTile() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: 'repeating-linear-gradient(90deg,#3b82c4 0px,#3b82c4 8px,#4a91d1 8px,#4a91d1 16px)' }}
    />
  )
}

export function WorldObjectView({ kind, label }: { kind: ObjectKind; label: string }) {
  const common = 'w-full h-full flex items-center justify-center'
  switch (kind) {
    case 'tree':
      return (
        <div className={common} title={label}>
          <div className="relative">
            <div style={{ width: 10, height: 16, background: '#6b4226', margin: '0 auto' }} />
            <div style={{ width: 34, height: 30, background: '#2f7d32', border: '2px solid #12181f', position: 'absolute', top: -26, left: -12 }} />
          </div>
        </div>
      )
    case 'water':
      return <WaterTile />
    case 'board':
      return (
        <div className={common} title={label}>
          <Block top="#a97c50" side="#8a5a34">
            <div style={{ position: 'absolute', top: 6, left: 5, width: 10, height: 12, background: '#eef3f6', border: '1px solid #12181f' }} />
            <div style={{ position: 'absolute', top: 10, left: 18, width: 10, height: 12, background: '#eef3f6', border: '1px solid #12181f' }} />
          </Block>
        </div>
      )
    case 'computer':
      return (
        <div className={common} title={label}>
          <Block top="#8b8f99" side="#5d6270">
            <div style={{ position: 'absolute', top: 4, left: 6, width: 20, height: 14, background: '#1e293b', border: '2px solid #12181f' }} />
            <div style={{ position: 'absolute', top: 8, left: 10, width: 12, height: 6, background: '#38bdf8' }} />
          </Block>
        </div>
      )
    case 'chest':
      return (
        <div className={common} title={label}>
          <Block top="#9c6b2e" side="#6b4a1f">
            <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, background: '#f5c542', border: '1px solid #12181f', borderRadius: 2 }} />
          </Block>
        </div>
      )
    case 'shop':
      return (
        <div className={common} title={label}>
          <div className="relative">
            <div style={{ width: 40, height: 10, background: '#b3413c', border: '2px solid #12181f', clipPath: 'polygon(0 0,100% 0,90% 100%,10% 100%)' }} />
            <div style={{ width: 34, height: 20, background: '#c2a06b', border: '2px solid #12181f', margin: '0 auto' }} />
          </div>
        </div>
      )
    case 'bed':
      return (
        <div className={common} title={label}>
          <Block top="#e5e7eb" side="#b91c1c">
            <div style={{ position: 'absolute', top: 6, left: 4, width: 14, height: 8, background: '#f8fafc', border: '1px solid #12181f' }} />
          </Block>
        </div>
      )
    case 'bookshelf':
      return (
        <div className={common} title={label}>
          <Block top="#8b5e34" side="#5c3d1f">
            <div style={{ position: 'absolute', top: 4, left: 4, right: 4, display: 'flex', gap: 2 }}>
              <div style={{ width: 4, height: 16, background: '#f87171' }} />
              <div style={{ width: 4, height: 16, background: '#60a5fa' }} />
              <div style={{ width: 4, height: 16, background: '#facc15' }} />
              <div style={{ width: 4, height: 16, background: '#4ade80' }} />
            </div>
          </Block>
        </div>
      )
    case 'mail':
      return (
        <div className={common} title={label}>
          <Block top="#d1a15c" side="#a8763a">
            <div style={{ position: 'absolute', top: 8, left: 4, width: 24, height: 16, background: '#eef3f6', border: '2px solid #12181f' }} />
            <div style={{ position: 'absolute', top: 8, left: 4, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '10px solid #a8763a' }} />
          </Block>
        </div>
      )
    default:
      return null
  }
}
