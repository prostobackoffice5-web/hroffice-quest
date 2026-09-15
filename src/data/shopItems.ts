import type { Rarity, ShopCategory, ShopItem } from '../types'

export const SHOP_CATEGORY_LABELS: Record<ShopCategory, string> = {
  home: 'Дом',
  clothes: 'Одежда',
  character: 'Персонаж',
  office: 'Офис',
  nature: 'Природа',
  rare: 'Сокровищница',
  event: 'События',
}

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Обычный',
  uncommon: 'Необычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный',
  mythic: 'Мифический',
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#9ca3af',
  uncommon: '#4ade80',
  rare: '#38bdf8',
  epic: '#a78bfa',
  legendary: '#f5c542',
  mythic: '#f472b6',
}

const RARITY_ORDER: Rarity[] = ['common', 'common', 'uncommon', 'uncommon', 'rare', 'epic']
const PRICE_BY_RARITY: Record<Rarity, number[]> = {
  common: [100, 150],
  uncommon: [200, 300],
  rare: [350, 500],
  epic: [550, 750],
  legendary: [800, 1000],
  mythic: [900, 1000],
}

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]
}

interface Template {
  category: ShopCategory
  nouns: string[]
  adjectives: string[]
  colors: string[]
  slot: ShopItem['slot']
  patchKind?: 'outfit' | 'accessory' | 'none'
}

const TEMPLATES: Template[] = [
  {
    category: 'home',
    nouns: ['Кровать', 'Стол', 'Стул', 'Шкаф', 'Полка', 'Ковёр', 'Лампа', 'Картина', 'Растение', 'Сундук', 'Окно', 'Дверь', 'Стена', 'Пол', 'Диван'],
    adjectives: ['деревянный', 'каменный', 'уютный', 'резной', 'простой', 'массивный', 'изящный', 'старинный', 'современный'],
    colors: ['#a3612e', '#8b5e34', '#c2a06b', '#6b4f32', '#94a3b8', '#f5c542', '#4ade80'],
    slot: 'furniture',
  },
  {
    category: 'clothes',
    nouns: ['Шапка', 'Причёска', 'Обувь', 'Куртка', 'Свитер', 'Плащ', 'Рюкзак', 'Очки', 'Шарф', 'Перчатки'],
    adjectives: ['вязаный', 'кожаный', 'летний', 'зимний', 'праздничный', 'рабочий', 'спортивный'],
    colors: ['#22c55e', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#f59e0b', '#0ea5e9'],
    slot: 'outfit',
  },
  {
    category: 'character',
    nouns: ['Питомец', 'Эффект', 'След', 'Аура', 'Крылья', 'Тень', 'Сияние'],
    adjectives: ['звёздный', 'огненный', 'ледяной', 'радужный', 'тёмный', 'солнечный', 'призрачный'],
    colors: ['#f97316', '#38bdf8', '#a78bfa', '#f472b6', '#facc15', '#34d399'],
    slot: 'accessory',
  },
  {
    category: 'office',
    nouns: ['Компьютер', 'Монитор', 'Стол', 'Кресло', 'Доска', 'Шкаф', 'Документы', 'Растение', 'Лампа', 'Принтер'],
    adjectives: ['офисный', 'современный', 'минималистичный', 'деловой', 'компактный', 'премиальный'],
    colors: ['#64748b', '#334155', '#0ea5e9', '#f59e0b', '#22c55e', '#94a3b8'],
    slot: 'furniture',
  },
  {
    category: 'nature',
    nouns: ['Дерево', 'Цветок', 'Куст', 'Камень', 'Гриб', 'Фонарь', 'Дорожка', 'Пруд', 'Кустарник', 'Клумба'],
    adjectives: ['весенний', 'осенний', 'цветущий', 'мшистый', 'каменный', 'светящийся'],
    colors: ['#4ade80', '#22c55e', '#84cc16', '#a3612e', '#38bdf8', '#facc15'],
    slot: 'furniture',
  },
  {
    category: 'rare',
    nouns: ['Портал', 'Статуя', 'Трон', 'Фонтан', 'Кристалл', 'Реликвия', 'Артефакт', 'Корона', 'Скипетр'],
    adjectives: ['золотой', 'магический', 'древний', 'сияющий', 'мистический', 'вечный'],
    colors: ['#f5c542', '#f472b6', '#a78bfa', '#38bdf8', '#f97316'],
    slot: 'furniture',
  },
]

const COUNTS: Record<ShopCategory, number> = {
  home: 35,
  clothes: 35,
  character: 30,
  office: 30,
  nature: 35,
  rare: 35,
  event: 0,
}

function buildCategory(t: Template): ShopItem[] {
  const items: ShopItem[] = []
  const count = COUNTS[t.category]
  for (let i = 0; i < count; i++) {
    const noun = pick(t.nouns, i)
    const adj = pick(t.adjectives, Math.floor(i / t.nouns.length))
    const color = pick(t.colors, i)
    const rarity: Rarity =
      t.category === 'rare'
        ? pick<Rarity>(['epic', 'legendary', 'mythic'], i)
        : pick(RARITY_ORDER, i)
    const [min, max] = PRICE_BY_RARITY[rarity]
    const price = Math.round((min + ((max - min) * (i % 5)) / 4) / 10) * 10
    const useSparks = t.category === 'rare' && (rarity === 'legendary' || rarity === 'mythic')
    const combo = t.category === 'rare' && rarity === 'mythic'

    items.push({
      id: `${t.category}-${i}`,
      name: `${adj[0].toUpperCase()}${adj.slice(1)} ${noun.toLowerCase()}`,
      category: t.category,
      slot: t.slot,
      rarity,
      currency: combo ? 'combo' : useSparks ? 'sparks' : 'coins',
      priceCoins: combo ? 1000 : useSparks ? undefined : price,
      priceSparks: combo ? 50 : useSparks ? Math.round(price / 8) : undefined,
      color,
      description: `${noun} категории «${SHOP_CATEGORY_LABELS[t.category]}». Редкость: ${RARITY_LABELS[rarity]}.`,
      patch: t.slot === 'outfit' ? { outfitColor: color } : t.slot === 'accessory' ? { accessory: `${t.category}-${i}` } : undefined,
    })
  }
  return items
}

export const SHOP_ITEMS: ShopItem[] = TEMPLATES.flatMap(buildCategory)

export function eventItemsFor(eventId: string, eventTitle: string): ShopItem[] {
  return [1, 2].map((n) => ({
    id: `event-${eventId}-${n}`,
    name: `Приз ивента «${eventTitle}» №${n}`,
    category: 'event',
    slot: n === 1 ? 'furniture' : 'accessory',
    rarity: 'legendary',
    currency: 'coins',
    priceCoins: undefined,
    color: '#f5c542',
    description: `Эксклюзивная награда за завершение проекта-ивента «${eventTitle}». Больше недоступна для получения.`,
    eventId,
  }))
}
