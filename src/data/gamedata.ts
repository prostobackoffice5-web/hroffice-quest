import type { ShopItem } from '../types'

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'outfit-green', name: 'Зелёная роба', slot: 'outfit', price: 30, color: '#22c55e', patch: { outfitColor: '#22c55e' } },
  { id: 'outfit-blue', name: 'Синяя роба', slot: 'outfit', price: 30, color: '#3b82f6', patch: { outfitColor: '#3b82f6' } },
  { id: 'outfit-red', name: 'Красная роба', slot: 'outfit', price: 40, color: '#ef4444', patch: { outfitColor: '#ef4444' } },
  { id: 'outfit-gold', name: 'Золотая мантия', slot: 'outfit', price: 120, color: '#f59e0b', patch: { outfitColor: '#f59e0b' } },
  { id: 'acc-glasses', name: 'Очки', slot: 'accessory', price: 25, color: '#38bdf8', patch: { accessory: 'glasses' } },
  { id: 'acc-hat', name: 'Шляпа', slot: 'accessory', price: 35, color: '#a3612e', patch: { accessory: 'hat' } },
  { id: 'acc-cape', name: 'Плащ', slot: 'accessory', price: 90, color: '#7c3aed', patch: { accessory: 'cape' } },
  { id: 'furn-plant', name: 'Цветок в горшке', slot: 'furniture', price: 20, color: '#22c55e' },
  { id: 'furn-lamp', name: 'Лампа', slot: 'furniture', price: 45, color: '#facc15' },
]

export interface AchievementDef {
  id: string
  title: string
  target: number
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: 'done-1', title: 'Выполнено 1 задание', target: 1 },
  { id: 'done-10', title: 'Выполнено 10 заданий', target: 10 },
  { id: 'done-50', title: 'Выполнено 50 заданий', target: 50 },
  { id: 'done-100', title: 'Выполнено 100 заданий', target: 100 },
]
