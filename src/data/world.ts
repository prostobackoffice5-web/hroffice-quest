export const GRID_COLS = 12
export const GRID_ROWS = 8
export const TILE = 56

export type ObjectKind = 'board' | 'computer' | 'chest' | 'shop' | 'bed' | 'bookshelf' | 'tree' | 'water'

export interface WorldObject {
  id: string
  kind: ObjectKind
  x: number
  y: number
  label: string
  interactive: boolean
}

export const WORLD_OBJECTS: WorldObject[] = [
  { id: 'board', kind: 'board', x: 3, y: 2, label: 'Доска заданий', interactive: true },
  { id: 'computer', kind: 'computer', x: 5, y: 2, label: 'Компьютер', interactive: true },
  { id: 'bookshelf', kind: 'bookshelf', x: 7, y: 2, label: 'Книжный шкаф', interactive: true },
  { id: 'bed', kind: 'bed', x: 8, y: 4, label: 'Кровать', interactive: true },
  { id: 'chest', kind: 'chest', x: 3, y: 5, label: 'Сундук', interactive: true },
  { id: 'shop', kind: 'shop', x: 9, y: 6, label: 'Магазин', interactive: true },
  { id: 'tree-1', kind: 'tree', x: 0, y: 0, label: 'Дерево', interactive: false },
  { id: 'tree-2', kind: 'tree', x: 11, y: 0, label: 'Дерево', interactive: false },
  { id: 'tree-3', kind: 'tree', x: 0, y: 7, label: 'Дерево', interactive: false },
  { id: 'tree-4', kind: 'tree', x: 1, y: 6, label: 'Дерево', interactive: false },
  { id: 'tree-5', kind: 'tree', x: 10, y: 1, label: 'Дерево', interactive: false },
  { id: 'water-1', kind: 'water', x: 6, y: 6, label: 'Вода', interactive: false },
  { id: 'water-2', kind: 'water', x: 7, y: 6, label: 'Вода', interactive: false },
]

export function isBlocked(x: number, y: number): WorldObject | undefined {
  return WORLD_OBJECTS.find((o) => o.x === x && o.y === y)
}

export function nearbyInteractive(x: number, y: number): WorldObject | undefined {
  return WORLD_OBJECTS.find((o) => o.interactive && Math.abs(o.x - x) + Math.abs(o.y - y) === 1)
}
