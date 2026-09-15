export type PlayerId = 'arai' | 'linara'

export type Assignee = PlayerId | 'both'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type TaskStatus = 'new' | 'in_progress' | 'review' | 'done'

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
  progress: number
  jointProgress?: { arai: number; linara: number }
  xp: number
  coins: number
  urgent: boolean
  urgentDeadline?: string
  bonusXp?: number
  bonusCoins?: number
  bonusSparks?: number
  deadline?: string
  projectId?: string
  createdAt: string
  completedAt?: string
}

export interface Project {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  participants: PlayerId[]
  rewardItemIds: string[]
  completed: boolean
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

export type ShopCategory = 'home' | 'clothes' | 'character' | 'office' | 'nature' | 'rare' | 'event'
export type EquipmentSlot = 'outfit' | 'accessory' | 'furniture'
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
export type Currency = 'coins' | 'sparks' | 'combo'

export interface ShopItem {
  id: string
  name: string
  category: ShopCategory
  slot: EquipmentSlot
  rarity: Rarity
  currency: Currency
  priceCoins?: number
  priceSparks?: number
  color: string
  description: string
  patch?: Partial<Appearance>
  eventId?: string
}

export interface InventoryEntry {
  itemId: string
  acquiredAt: string
  favorite?: boolean
}

export type ActionRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'event'

export interface ActionDef {
  id: string
  label: string
  icon: string
  rarity: ActionRarity
  currency: Currency | 'free'
  priceCoins?: number
  priceSparks?: number
  eventId?: string
  effect: string
}

export interface Message {
  id: string
  from: PlayerId
  to: PlayerId
  text: string
  taskId?: string
  createdAt: string
  read: boolean
}

export interface WorldEvent {
  id: string
  from: PlayerId
  to: PlayerId
  actionId: string
  createdAt: string
}

export interface GameNotification {
  id: string
  player: PlayerId
  icon: string
  text: string
  createdAt: string
}

export interface Character {
  id: PlayerId
  name: string
  appearance: Appearance
  xp: number
  coins: number
  sparks: number
  createdCharacter: boolean
  inventory: InventoryEntry[]
  ownedActions: string[]
  equippedOutfit?: string
  equippedAccessory?: string
  homeFurniture: string[]
  position: { x: number; y: number }
}

export interface AppState {
  characters: Record<PlayerId, Character>
  categories: Category[]
  tasks: Task[]
  projects: Project[]
  messages: Message[]
  worldEvents: WorldEvent[]
  notifications: GameNotification[]
  currentPlayer: PlayerId | null
  lastLevelUp: { player: PlayerId; level: number } | null
  lastReward: { xp: number; coins: number; sparks: number; key: string } | null
}
