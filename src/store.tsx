import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { AppState, Category, PlayerId, Project, Task } from './types'
import { buildEmptyState } from './data/seed'
import { levelFromXp } from './data/engine'
import { SHOP_ITEMS } from './data/gamedata'
import { GRID_COLS, GRID_ROWS, isBlocked } from './data/world'

const STORAGE_KEY = 'office-quest-state-v3'

type Action =
  | { type: 'SELECT_PLAYER'; player: PlayerId }
  | { type: 'LOGOUT' }
  | { type: 'FINISH_CREATION'; player: PlayerId; name: string }
  | { type: 'SET_APPEARANCE'; player: PlayerId; appearance: Partial<AppState['characters']['arai']['appearance']> }
  | { type: 'MOVE'; player: PlayerId; dx: number; dy: number }
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; task: Task }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'COMPLETE_TASK'; id: string }
  | { type: 'ADD_PROJECT'; project: Project }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'BUY_ITEM'; player: PlayerId; itemId: string }
  | { type: 'EQUIP_ITEM'; player: PlayerId; itemId: string }
  | { type: 'UNEQUIP_SLOT'; player: PlayerId; slot: 'outfit' | 'accessory' }
  | { type: 'CLEAR_LEVEL_UP' }
  | { type: 'CLEAR_REWARD' }

function loadInitial(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {
    // ignore and fall back to empty state
  }
  return buildEmptyState()
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_PLAYER':
      return { ...state, currentPlayer: action.player }
    case 'LOGOUT':
      return { ...state, currentPlayer: null }
    case 'FINISH_CREATION':
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.player]: { ...state.characters[action.player], createdCharacter: true, name: action.name },
        },
      }
    case 'SET_APPEARANCE':
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.player]: {
            ...state.characters[action.player],
            appearance: { ...state.characters[action.player].appearance, ...action.appearance },
          },
        },
      }
    case 'MOVE': {
      const character = state.characters[action.player]
      const nx = Math.max(0, Math.min(GRID_COLS - 1, character.position.x + action.dx))
      const ny = Math.max(0, Math.min(GRID_ROWS - 1, character.position.y + action.dy))
      if (isBlocked(nx, ny)) return state
      return { ...state, characters: { ...state.characters, [action.player]: { ...character, position: { x: nx, y: ny } } } }
    }
    case 'ADD_TASK':
      return { ...state, tasks: [action.task, ...state.tasks] }
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map((t) => (t.id === action.task.id ? action.task : t)) }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) }
    case 'COMPLETE_TASK': {
      const task = state.tasks.find((t) => t.id === action.id)
      if (!task || task.status === 'done') return state
      const character = state.characters[task.assignee]
      const newXp = character.xp + task.xp
      const oldLevel = levelFromXp(character.xp)
      const newLevel = levelFromXp(newXp)
      const leveledUp = newLevel > oldLevel
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, status: 'done', completedAt: new Date().toISOString() } : t)),
        characters: {
          ...state.characters,
          [task.assignee]: { ...character, xp: newXp, coins: character.coins + task.coins },
        },
        lastLevelUp: leveledUp ? { player: task.assignee, level: newLevel } : state.lastLevelUp,
        lastReward: { xp: task.xp, coins: task.coins, key: `${task.assignee}-${Date.now()}` },
      }
    }
    case 'ADD_PROJECT':
      return { ...state, projects: [action.project, ...state.projects] }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.category] }
    case 'BUY_ITEM': {
      const character = state.characters[action.player]
      const item = SHOP_ITEMS.find((i) => i.id === action.itemId)
      if (!item || character.coins < item.price || character.inventory.some((i) => i.itemId === item.id)) return state
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.player]: {
            ...character,
            coins: character.coins - item.price,
            inventory: [...character.inventory, { itemId: item.id, acquiredAt: new Date().toISOString() }],
          },
        },
      }
    }
    case 'EQUIP_ITEM': {
      const character = state.characters[action.player]
      const item = SHOP_ITEMS.find((i) => i.id === action.itemId)
      if (!item || item.slot === 'furniture') return state
      const field = item.slot === 'outfit' ? 'equippedOutfit' : 'equippedAccessory'
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.player]: {
            ...character,
            [field]: item.id,
            appearance: { ...character.appearance, ...item.patch },
          },
        },
      }
    }
    case 'UNEQUIP_SLOT': {
      const character = state.characters[action.player]
      const field = action.slot === 'outfit' ? 'equippedOutfit' : 'equippedAccessory'
      return { ...state, characters: { ...state.characters, [action.player]: { ...character, [field]: undefined } } }
    }
    case 'CLEAR_LEVEL_UP':
      return { ...state, lastLevelUp: null }
    case 'CLEAR_REWARD':
      return { ...state, lastReward: null }
    default:
      return state
  }
}

interface StoreValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
