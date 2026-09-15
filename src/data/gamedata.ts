import type { Achievement, ShopItem, SkillState } from '../types'

export const RARITY_META: Record<string, { label: string; color: string }> = {
  common: { label: 'Common', color: '#9ca3af' },
  uncommon: { label: 'Uncommon', color: '#4ade80' },
  rare: { label: 'Rare', color: '#38bdf8' },
  epic: { label: 'Epic', color: '#a78bfa' },
  legendary: { label: 'Legendary', color: '#fbbf24' },
}

export const SHOP_ITEMS: ShopItem[] = [
  // Hair (5)
  { id: 'hair-ember', name: 'Ember Hair', slot: 'hair', rarity: 'common', price: 40, icon: '💇', patch: { hairColor: '#e8674a' } },
  { id: 'hair-frost', name: 'Frost Hair', slot: 'hair', rarity: 'common', price: 40, icon: '💇', patch: { hairColor: '#bcd9f0' } },
  { id: 'hair-midnight', name: 'Midnight Hair', slot: 'hair', rarity: 'uncommon', price: 90, icon: '💇', patch: { hairColor: '#1c1c2e' } },
  { id: 'hair-gold', name: 'Gold Hair', slot: 'hair', rarity: 'rare', price: 220, icon: '💇', patch: { hairColor: '#f5c542' } },
  { id: 'hair-legend', name: 'Legendary Rainbow Hair', slot: 'hair', rarity: 'legendary', price: 900, icon: '💇', patch: { hairColor: '#ff6ec7' }, unlockLevel: 15 },
  // Clothes (5)
  { id: 'outfit-explorer', name: "Explorer's Vest", slot: 'clothes', rarity: 'common', price: 50, icon: '👕', patch: { outfitColor: '#84cc16' } },
  { id: 'outfit-office', name: 'Cozy Office Cardigan', slot: 'clothes', rarity: 'common', price: 50, icon: '🧥', patch: { outfitColor: '#f472b6' } },
  { id: 'outfit-builder', name: 'Builder Overalls', slot: 'clothes', rarity: 'uncommon', price: 120, icon: '👖', patch: { outfitColor: '#fb923c' } },
  { id: 'outfit-royal', name: 'Royal Cape', slot: 'clothes', rarity: 'epic', price: 400, icon: '🧣', patch: { outfitColor: '#8b5cf6' }, unlockLevel: 10 },
  { id: 'outfit-legend', name: 'Legend Armor', slot: 'clothes', rarity: 'legendary', price: 950, icon: '🛡️', patch: { outfitColor: '#facc15' }, unlockLevel: 20 },
  // Accessories (4)
  { id: 'acc-glasses', name: 'Focus Glasses', slot: 'accessory', rarity: 'common', price: 35, icon: '👓', patch: { accessory: 'glasses' } },
  { id: 'acc-headphones', name: 'Deep Work Headphones', slot: 'accessory', rarity: 'uncommon', price: 100, icon: '🎧', patch: { accessory: 'headphones' } },
  { id: 'acc-backpack', name: 'Adventurer Backpack', slot: 'accessory', rarity: 'rare', price: 180, icon: '🎒', patch: { accessory: 'backpack' } },
  { id: 'acc-crown', name: 'Tiny Crown', slot: 'accessory', rarity: 'epic', price: 380, icon: '👑', patch: { accessory: 'crown' }, unlockLevel: 12 },
  // Furniture (3)
  { id: 'furn-plant', name: 'Potted Plant', slot: 'furniture', rarity: 'common', price: 30, icon: '🌿', patch: { furnitureIcon: '🌿' } },
  { id: 'furn-desk', name: 'Standing Desk', slot: 'furniture', rarity: 'uncommon', price: 150, icon: '🖥️', patch: { furnitureIcon: '🖥️' } },
  { id: 'furn-bookshelf', name: 'Bookshelf', slot: 'furniture', rarity: 'rare', price: 260, icon: '📚', patch: { furnitureIcon: '📚' } },
  // Special / Effects (3)
  { id: 'fx-sparkle', name: 'Sparkle Aura', slot: 'effect', rarity: 'rare', price: 200, icon: '✨', patch: { effect: 'sparkle' } },
  { id: 'fx-flame', name: 'Flame Trail', slot: 'effect', rarity: 'epic', price: 420, icon: '🔥', patch: { effect: 'flame' }, unlockLevel: 8 },
  { id: 'fx-aurora', name: 'Aurora Glow', slot: 'effect', rarity: 'legendary', price: 999, icon: '🌈', patch: { effect: 'aurora' }, unlockLevel: 18 },
]

export const SKILL_DEFS: { id: string; name: string; icon: string; categoryId: string }[] = [
  { id: 'recruiting', name: 'Recruiting', icon: '👤', categoryId: 'recruiting' },
  { id: 'organization', name: 'Organization', icon: '🗂️', categoryId: 'office' },
  { id: 'communication', name: 'Communication', icon: '🗣️', categoryId: 'meetings' },
  { id: 'automation', name: 'Automation', icon: '⚙️', categoryId: 'automation' },
  { id: 'analytics', name: 'Analytics', icon: '📊', categoryId: 'surveys' },
  { id: 'management', name: 'Management', icon: '🧭', categoryId: 'partners' },
  { id: 'training', name: 'Training', icon: '🎓', categoryId: 'training' },
]

export function defaultSkills(): SkillState[] {
  return SKILL_DEFS.map((s) => ({ id: s.id, name: s.name, icon: s.icon, categoryId: s.categoryId, xp: 0 }))
}

export const ACHIEVEMENTS: (Achievement & { check: (stats: Stats) => boolean })[] = [
  { id: 'first-quest', title: 'FIRST QUEST', icon: '🏆', description: 'Выполнить первую задачу', check: (s) => s.completed >= 1 },
  { id: 'quest-master', title: 'QUEST MASTER', icon: '🏆', description: 'Выполнить 100 задач', check: (s) => s.completed >= 100 },
  { id: 'speedrunner', title: 'SPEEDRUNNER', icon: '🏆', description: 'Успешно завершить 10 Time Challenges', check: (s) => s.timeChallengesWon >= 10 },
  { id: 'automation-wizard', title: 'AUTOMATION WIZARD', icon: '🏆', description: 'Выполнить 25 задач по автоматизации', check: (s) => (s.byCategory['automation'] ?? 0) >= 25 },
  { id: 'organizer', title: 'ORGANIZER', icon: '🏆', description: 'Завершить 10 задач категории «Мероприятия»', check: (s) => (s.byCategory['events'] ?? 0) >= 10 },
  { id: 'streak-master', title: 'STREAK MASTER', icon: '🏆', description: 'Получить streak 30 дней', check: (s) => s.streak >= 30 },
  { id: 'boss-slayer', title: 'BOSS SLAYER', icon: '🏆', description: 'Завершить 10 Boss Quests', check: (s) => s.bossesDone >= 10 },
  { id: 'builder', title: 'BUILDER', icon: '🏆', description: 'Открыть 20 предметов для комнаты', check: (s) => s.itemsOwned >= 20 },
  { id: 'collector', title: 'COLLECTOR', icon: '🏆', description: 'Собрать 50 косметических предметов', check: (s) => s.itemsOwned >= 50 },
]

export interface Stats {
  completed: number
  byCategory: Record<string, number>
  streak: number
  timeChallengesWon: number
  bossesDone: number
  itemsOwned: number
}

export const NPCS = [
  { id: 'librarian', name: 'Librarian', icon: '📚', line: 'Держи знания в порядке — учёба открывает новые главы.' },
  { id: 'builder', name: 'Builder', icon: '🛠', line: 'Каждый завершённый квест — ещё один кирпичик в твоей базе.' },
  { id: 'quest-master', name: 'Quest Master', icon: '🧙', line: 'Только сильные духом берутся за Boss Quest.' },
  { id: 'merchant', name: 'Merchant', icon: '🎁', line: 'Загляни в лавку — сегодня завезли редкие вещи.' },
]

export const SEASON_TRACK: { level: number; reward: string; icon: string }[] = [
  { level: 1, reward: '+20 Coins', icon: '🪙' },
  { level: 2, reward: 'Common Item', icon: '🎁' },
  { level: 3, reward: '+50 Coins', icon: '🪙' },
  { level: 4, reward: 'Uncommon Item', icon: '🎁' },
  { level: 5, reward: 'Rare Skin', icon: '✨' },
  { level: 6, reward: '+100 Coins', icon: '🪙' },
  { level: 7, reward: 'Epic Item', icon: '🎁' },
  { level: 8, reward: '+150 Coins', icon: '🪙' },
  { level: 9, reward: 'Effect Unlock', icon: '🌈' },
  { level: 10, reward: 'Legendary Skin', icon: '👑' },
]

export const SEASON_XP_PER_LEVEL = 150
