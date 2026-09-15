import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { AppState, Category, Message, PlayerId, Project, ShopItem, Task } from './types'
import { buildEmptyState } from './data/seed'
import { levelFromXp } from './data/engine'
import { SHOP_ITEMS, eventItemsFor } from './data/shopItems'
import { ACTION_DEFS } from './data/actions'
import { GRID_COLS, GRID_ROWS, isBlocked } from './data/world'
import { uid } from './utils'

const STORAGE_KEY = 'office-quest-state-v4'

type Action =
  | { type: 'SELECT_PLAYER'; player: PlayerId }
  | { type: 'LOGOUT' }
  | { type: 'FINISH_CREATION'; player: PlayerId; name: string }
  | { type: 'SET_APPEARANCE'; player: PlayerId; appearance: Partial<AppState['characters']['arai']['appearance']> }
  | { type: 'MOVE'; player: PlayerId; dx: number; dy: number }
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; task: Task }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'SET_TASK_STATUS'; id: string; status: Task['status'] }
  | { type: 'SET_TASK_PROGRESS'; id: string; player: PlayerId; progress: number }
  | { type: 'COMPLETE_TASK'; id: string; player: PlayerId }
  | { type: 'ADD_PROJECT'; project: Omit<Project, 'rewardItemIds' | 'completed'> }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'BUY_ITEM'; player: PlayerId; itemId: string }
  | { type: 'EQUIP_ITEM'; player: PlayerId; itemId: string }
  | { type: 'UNEQUIP_SLOT'; player: PlayerId; slot: 'outfit' | 'accessory' }
  | { type: 'TOGGLE_FAVORITE'; player: PlayerId; itemId: string }
  | { type: 'TOGGLE_FURNITURE'; player: PlayerId; itemId: string }
  | { type: 'BUY_ACTION'; player: PlayerId; actionId: string }
  | { type: 'PERFORM_ACTION'; from: PlayerId; to: PlayerId; actionId: string }
  | { type: 'SEND_MESSAGE'; from: PlayerId; to: PlayerId; text: string; taskId?: string }
  | { type: 'MARK_MESSAGES_READ'; player: PlayerId }
  | { type: 'DISMISS_NOTIFICATION'; id: string }
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

function notify(state: AppState, player: PlayerId, icon: string, text: string): AppState {
  return { ...state, notifications: [{ id: uid('note'), player, icon, text, createdAt: new Date().toISOString() }, ...state.notifications].slice(0, 30) }
}

function allShopItems(state: AppState): ShopItem[] {
  const eventItems = state.projects.flatMap((p) => eventItemsFor(p.id, p.title))
  return [...SHOP_ITEMS, ...eventItems]
}

function checkProjectCompletion(state: AppState, projectId: string): AppState {
  const project = state.projects.find((p) => p.id === projectId)
  if (!project || project.completed) return state
  const subtasks = state.tasks.filter((t) => t.projectId === projectId)
  if (subtasks.length === 0 || !subtasks.every((t) => t.status === 'done')) return state

  let next: AppState = { ...state, projects: state.projects.map((p) => (p.id === projectId ? { ...p, completed: true } : p)) }
  const rewardItems = eventItemsFor(project.id, project.title)
  for (const participant of project.participants) {
    const character = next.characters[participant]
    next = {
      ...next,
      characters: {
        ...next.characters,
        [participant]: {
          ...character,
          sparks: character.sparks + 30,
          inventory: [...character.inventory, ...rewardItems.map((it) => ({ itemId: it.id, acquiredAt: new Date().toISOString() }))],
        },
      },
    }
    next = notify(next, participant, '🏆', `Ивент «${project.title}» завершён! Получены эксклюзивные предметы и искры.`)
  }
  return next
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_PLAYER':
      return { ...state, currentPlayer: action.player }
    case 'LOGOUT':
      return { ...state, currentPlayer: null }
    case 'FINISH_CREATION':
      return { ...state, characters: { ...state.characters, [action.player]: { ...state.characters[action.player], createdCharacter: true, name: action.name } } }
    case 'SET_APPEARANCE':
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.player]: { ...state.characters[action.player], appearance: { ...state.characters[action.player].appearance, ...action.appearance } },
        },
      }
    case 'MOVE': {
      const character = state.characters[action.player]
      const nx = Math.max(0, Math.min(GRID_COLS - 1, character.position.x + action.dx))
      const ny = Math.max(0, Math.min(GRID_ROWS - 1, character.position.y + action.dy))
      if (isBlocked(nx, ny)) return state
      const other = state.characters[action.player === 'arai' ? 'linara' : 'arai']
      if (other.position.x === nx && other.position.y === ny) return state
      return { ...state, characters: { ...state.characters, [action.player]: { ...character, position: { x: nx, y: ny } } } }
    }
    case 'ADD_TASK': {
      let next: AppState = { ...state, tasks: [action.task, ...state.tasks] }
      if (action.task.assignee !== 'both') {
        next = notify(next, action.task.assignee, '🎯', `Новое задание: ${action.task.title}`)
      } else {
        next = notify(next, 'arai', '🎯', `Новое совместное задание: ${action.task.title}`)
        next = notify(next, 'linara', '🎯', `Новое совместное задание: ${action.task.title}`)
      }
      return next
    }
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map((t) => (t.id === action.task.id ? action.task : t)) }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) }
    case 'SET_TASK_STATUS':
      return { ...state, tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, status: action.status } : t)) }
    case 'SET_TASK_PROGRESS': {
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.id) return t
          if (t.assignee === 'both') {
            const jp = { arai: t.jointProgress?.arai ?? 0, linara: t.jointProgress?.linara ?? 0, [action.player]: action.progress }
            return { ...t, jointProgress: jp as { arai: number; linara: number } }
          }
          return { ...t, progress: action.progress }
        }),
      }
    }
    case 'COMPLETE_TASK': {
      const task = state.tasks.find((t) => t.id === action.id)
      if (!task || task.status === 'done') return state

      const onTimeUrgent = task.urgent && task.urgentDeadline && new Date(task.urgentDeadline).getTime() >= Date.now()
      const xpGain = task.xp + (onTimeUrgent ? task.bonusXp ?? 0 : 0)
      const coinsGain = task.coins + (onTimeUrgent ? task.bonusCoins ?? 0 : 0)
      const sparksGain = onTimeUrgent ? task.bonusSparks ?? 0 : 0

      const recipients: PlayerId[] = task.assignee === 'both' ? ['arai', 'linara'] : [task.assignee]
      let next: AppState = { ...state, tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, status: 'done', progress: 100, completedAt: new Date().toISOString() } : t)) }

      for (const recipient of recipients) {
        const character = next.characters[recipient]
        const newXp = character.xp + xpGain
        const oldLevel = levelFromXp(character.xp)
        const newLevel = levelFromXp(newXp)
        next = {
          ...next,
          characters: { ...next.characters, [recipient]: { ...character, xp: newXp, coins: character.coins + coinsGain, sparks: character.sparks + sparksGain } },
          lastLevelUp: newLevel > oldLevel ? { player: recipient, level: newLevel } : next.lastLevelUp,
        }
        next = notify(next, recipient, '🎉', `Задание завершено: ${task.title}`)
      }
      next = { ...next, lastReward: { xp: xpGain, coins: coinsGain, sparks: sparksGain, key: `${action.player}-${Date.now()}` } }

      if (task.projectId) next = checkProjectCompletion(next, task.projectId)
      return next
    }
    case 'ADD_PROJECT':
      return { ...state, projects: [{ ...action.project, rewardItemIds: eventItemsFor(action.project.id, action.project.title).map((i) => i.id), completed: false }, ...state.projects] }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.category] }
    case 'BUY_ITEM': {
      const character = state.characters[action.player]
      const item = allShopItems(state).find((i) => i.id === action.itemId)
      if (!item || item.eventId || character.inventory.some((i) => i.itemId === item.id)) return state
      if (item.currency === 'coins' && character.coins < (item.priceCoins ?? 0)) return state
      if (item.currency === 'sparks' && character.sparks < (item.priceSparks ?? 0)) return state
      if (item.currency === 'combo' && (character.coins < (item.priceCoins ?? 0) || character.sparks < (item.priceSparks ?? 0))) return state
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.player]: {
            ...character,
            coins: character.coins - (item.currency !== 'sparks' ? item.priceCoins ?? 0 : 0),
            sparks: character.sparks - (item.currency !== 'coins' ? item.priceSparks ?? 0 : 0),
            inventory: [...character.inventory, { itemId: item.id, acquiredAt: new Date().toISOString() }],
          },
        },
      }
    }
    case 'EQUIP_ITEM': {
      const character = state.characters[action.player]
      const item = allShopItems(state).find((i) => i.id === action.itemId)
      if (!item || item.slot === 'furniture') return state
      const field = item.slot === 'outfit' ? 'equippedOutfit' : 'equippedAccessory'
      return {
        ...state,
        characters: { ...state.characters, [action.player]: { ...character, [field]: item.id, appearance: { ...character.appearance, ...item.patch } } },
      }
    }
    case 'UNEQUIP_SLOT': {
      const character = state.characters[action.player]
      const field = action.slot === 'outfit' ? 'equippedOutfit' : 'equippedAccessory'
      return { ...state, characters: { ...state.characters, [action.player]: { ...character, [field]: undefined } } }
    }
    case 'TOGGLE_FAVORITE': {
      const character = state.characters[action.player]
      return {
        ...state,
        characters: { ...state.characters, [action.player]: { ...character, inventory: character.inventory.map((i) => (i.itemId === action.itemId ? { ...i, favorite: !i.favorite } : i)) } },
      }
    }
    case 'TOGGLE_FURNITURE': {
      const character = state.characters[action.player]
      const has = character.homeFurniture.includes(action.itemId)
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.player]: { ...character, homeFurniture: has ? character.homeFurniture.filter((i) => i !== action.itemId) : [...character.homeFurniture, action.itemId] },
        },
      }
    }
    case 'BUY_ACTION': {
      const character = state.characters[action.player]
      const def = ACTION_DEFS.find((a) => a.id === action.actionId)
      if (!def || character.ownedActions.includes(def.id)) return state
      if (def.currency === 'coins' && character.coins < (def.priceCoins ?? 0)) return state
      if (def.currency === 'sparks' && character.sparks < (def.priceSparks ?? 0)) return state
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.player]: {
            ...character,
            coins: character.coins - (def.currency === 'coins' ? def.priceCoins ?? 0 : 0),
            sparks: character.sparks - (def.currency === 'sparks' ? def.priceSparks ?? 0 : 0),
            ownedActions: [...character.ownedActions, def.id],
          },
        },
      }
    }
    case 'PERFORM_ACTION': {
      const def = ACTION_DEFS.find((a) => a.id === action.actionId)
      let next: AppState = { ...state, worldEvents: [...state.worldEvents, { id: uid('we'), from: action.from, to: action.to, actionId: action.actionId, createdAt: new Date().toISOString() }].slice(-10) }
      if (def) next = notify(next, action.to, def.icon, `${state.characters[action.from].name}: ${def.label}`)
      return next
    }
    case 'SEND_MESSAGE': {
      const message: Message = { id: uid('msg'), from: action.from, to: action.to, text: action.text, taskId: action.taskId, createdAt: new Date().toISOString(), read: false }
      let next: AppState = { ...state, messages: [...state.messages, message] }
      next = notify(next, action.to, '💬', `${state.characters[action.from].name}: ${action.text.slice(0, 40)}`)
      return next
    }
    case 'MARK_MESSAGES_READ':
      return { ...state, messages: state.messages.map((m) => (m.to === action.player ? { ...m, read: true } : m)) }
    case 'DISMISS_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter((n) => n.id !== action.id) }
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

export { allShopItems }
