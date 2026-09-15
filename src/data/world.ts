export const GRID_COLS = 13
export const GRID_ROWS = 9
export const TILE = 64

export type ObjectKind = 'board' | 'computer' | 'chest' | 'shop' | 'bed' | 'bookshelf' | 'mail' | 'tree' | 'water'

export interface WorldObject {
  id: string
  kind: ObjectKind
  x: number
  y: number
  label: string
  interactive: boolean
}

export const WORLD_OBJECTS: WorldObject[] = [
  { id: 'board', kind: 'board', x: 3, y: 2, label: 'Общая доска', interactive: true },
  { id: 'computer', kind: 'computer', x: 5, y: 2, label: 'Действия', interactive: true },
  { id: 'bookshelf', kind: 'bookshelf', x: 7, y: 2, label: 'Достижения', interactive: true },
  { id: 'mail', kind: 'mail', x: 10, y: 2, label: 'Почта', interactive: true },
  { id: 'bed-arai', kind: 'bed', x: 2, y: 6, label: 'Дом Арай', interactive: true },
  { id: 'bed-linara', kind: 'bed', x: 4, y: 6, label: 'Дом Линары', interactive: true },
  { id: 'chest', kind: 'chest', x: 8, y: 5, label: 'Сундук', interactive: true },
  { id: 'shop', kind: 'shop', x: 10, y: 6, label: 'Лавка', interactive: true },
  { id: 'tree-1', kind: 'tree', x: 0, y: 0, label: 'Дерево', interactive: false },
  { id: 'tree-2', kind: 'tree', x: 12, y: 0, label: 'Дерево', interactive: false },
  { id: 'tree-3', kind: 'tree', x: 0, y: 8, label: 'Дерево', interactive: false },
  { id: 'tree-4', kind: 'tree', x: 1, y: 7, label: 'Дерево', interactive: false },
  { id: 'tree-5', kind: 'tree', x: 11, y: 1, label: 'Дерево', interactive: false },
  { id: 'tree-6', kind: 'tree', x: 6, y: 0, label: 'Дерево', interactive: false },
  { id: 'water-1', kind: 'water', x: 6, y: 6, label: 'Вода', interactive: false },
  { id: 'water-2', kind: 'water', x: 7, y: 6, label: 'Вода', interactive: false },
]

export function isBlocked(x: number, y: number): WorldObject | undefined {
  return WORLD_OBJECTS.find((o) => o.x === x && o.y === y)
}

export function nearbyInteractive(x: number, y: number): WorldObject | undefined {
  return WORLD_OBJECTS.find((o) => o.interactive && Math.abs(o.x - x) + Math.abs(o.y - y) === 1)
}
