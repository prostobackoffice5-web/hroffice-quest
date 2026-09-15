import type { AppState, Character } from '../types'
import { DEFAULT_CATEGORIES } from './categories'
import { ACTION_DEFS } from './actions'

const FREE_ACTIONS = ACTION_DEFS.filter((a) => a.currency === 'free').map((a) => a.id)

function emptyCharacter(id: 'arai' | 'linara', name: string, x: number, y: number): Character {
  return {
    id,
    name,
    appearance: {
      skinColor: '#f2c9a1',
      hairColor: '#4a3728',
      hairStyle: 0,
      outfitColor: '#94a3b8',
      shoesColor: '#3f3f46',
      accessory: 'none',
    },
    xp: 0,
    coins: 0,
    sparks: 0,
    createdCharacter: false,
    inventory: [],
    ownedActions: [...FREE_ACTIONS],
    homeFurniture: [],
    position: { x, y },
  }
}

export function buildEmptyState(): AppState {
  return {
    characters: {
      arai: emptyCharacter('arai', 'Арай', 5, 5),
      linara: emptyCharacter('linara', 'Линара', 6, 5),
    },
    categories: DEFAULT_CATEGORIES,
    tasks: [],
    projects: [],
    messages: [],
    worldEvents: [],
    notifications: [],
    currentPlayer: null,
    lastLevelUp: null,
    lastReward: null,
  }
}
