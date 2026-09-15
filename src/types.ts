export type PlayerId = 'arai' | 'linara'

export type Assignee = PlayerId

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type TaskStatus = 'active' | 'done'

export interface Category {
  id: string
  name: string
  color: string
  custom?: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  categoryId: string
  priority: Priority
  difficulty: Difficulty
  assignee: Assignee
  status: TaskStatus
  xp: number
  coins: number
  deadline?: string
  projectId?: string
  createdAt: string
  completedAt?: string
}

export interface Project {
  id: string
  title: string
  createdAt: string
}

export interface Appearance {
  skinColor: string
  hairColor: string
  hairStyle: number
  outfitColor: string
  shoesColor: string
  accessory: string
}

export type EquipmentSlot = 'outfit' | 'accessory' | 'furniture'

export interface ShopItem {
  id: string
  name: string
  slot: EquipmentSlot
  price: number
  color: string
  patch?: Partial<Appearance>
}

export interface InventoryEntry {
  itemId: string
  acquiredAt: string
}

export interface Character {
  id: PlayerId
  name: string
  appearance: Appearance
  xp: number
  coins: number
  createdCharacter: boolean
  inventory: InventoryEntry[]
  equippedOutfit?: string
  equippedAccessory?: string
  position: { x: number; y: number }
}

export interface AppState {
  characters: Record<PlayerId, Character>
  categories: Category[]
  tasks: Task[]
  projects: Project[]
  currentPlayer: PlayerId | null
  lastLevelUp: { player: PlayerId; level: number } | null
  lastReward: { xp: number; coins: number; key: string } | null
}
