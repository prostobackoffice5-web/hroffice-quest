export type PlayerId = 'arai' | 'linara'

export type Assignee = PlayerId | 'both'

export type QuestType = 'daily' | 'weekly' | 'onetime' | 'project'

export type QuestStatus = 'todo' | 'in_progress' | 'done'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type Difficulty = 'easy' | 'normal' | 'hard' | 'epic' | 'boss'

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export type TimeChallengeMode = 'relaxed' | 'standard' | 'rush' | 'extreme'

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  custom?: boolean
}

export interface TimeChallenge {
  enabled: boolean
  mode: TimeChallengeMode
  durationMinutes: number
  startedAt?: string
  succeededAt?: string
  failedAt?: string
}

export interface Quest {
  id: string
  title: string
  description?: string
  type: QuestType
  categoryId: string
  priority: Priority
  difficulty: Difficulty
  assignee: Assignee
  status: QuestStatus
  xp: number
  coins: number
  deadline?: string
  projectId?: string
  subtasks: Subtask[]
  completedAt?: string
  createdAt: string
  completedByBoth?: PlayerId[]
  timeChallenge?: TimeChallenge
  secret?: boolean
  boss?: boolean
}

export interface Project {
  id: string
  title: string
  icon: string
  ownerId: PlayerId
  participants: PlayerId[]
  createdAt: string
}

export interface Appearance {
  emoji: string
  skinColor: string
  hairColor: string
  outfitColor: string
  accessory: string
  effect?: string
}

export type EquipmentSlot = 'hair' | 'clothes' | 'accessory' | 'effect' | 'furniture'

export interface ShopItem {
  id: string
  name: string
  slot: EquipmentSlot
  rarity: Rarity
  price: number
  icon: string
  patch: Partial<Appearance> & { furnitureIcon?: string }
  unlockLevel?: number
}

export interface InventoryEntry {
  itemId: string
  acquiredAt: string
  favorite?: boolean
}

export interface Equipment {
  hair?: string
  clothes?: string
  accessory?: string
  effect?: string
}

export interface ActiveBoost {
  id: string
  kind: 'xp' | 'coins' | 'streakShield' | 'timeBonus' | 'critical'
  label: string
  icon: string
  expiresAt: string
  magnitude: number
}

export interface SkillState {
  id: string
  name: string
  icon: string
  categoryId: string
  xp: number
}

export interface Achievement {
  id: string
  title: string
  icon: string
  description: string
}

export interface ActiveEvent {
  id: string
  key: string
  title: string
  icon: string
  description: string
  expiresAt: string
  categoryId?: string
  xpMultiplier?: number
}

export interface Chest {
  id: string
  player: PlayerId
  source: string
  opened: boolean
  reward?: { xp: number; coins: number; itemId?: string }
  createdAt: string
}

export interface AppNotification {
  id: string
  player: PlayerId
  icon: string
  text: string
  createdAt: string
  read: boolean
}

export interface Character {
  id: PlayerId
  name: string
  role: 'owner' | 'member'
  title: string
  appearance: Appearance
  xp: number
  seasonXp: number
  coins: number
  streak: number
  lastActiveDate: string | null
  createdCharacter: boolean
  equipment: Equipment
  inventory: InventoryEntry[]
  boosts: ActiveBoost[]
  skills: SkillState[]
  unlockedAchievements: string[]
  reputation: number
  streakShieldUsedDate?: string
  claimedDaily?: string
  claimedWeekly?: string
  claimedGoal?: string
  onboardingDone: boolean
}

export interface AppState {
  characters: Record<PlayerId, Character>
  categories: Category[]
  quests: Quest[]
  projects: Project[]
  currentPlayer: PlayerId
  lastLevelUp: { player: PlayerId; level: number } | null
  lastReward: { xp: number; coins: number; key: string } | null
  activeEvents: ActiveEvent[]
  chests: Chest[]
  notifications: AppNotification[]
  worldLevel: number
  seasonId: string
  seasonEndsAt: string
}
