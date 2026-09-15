import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { AppNotification, AppState, Category, Chest, PlayerId, Project, Quest, TimeChallengeMode } from './types'
import { buildDemoState } from './data/seed'
import { levelFromXp, titleForLevel, todayKey } from './data/engine'
import { ACHIEVEMENTS, SHOP_ITEMS } from './data/gamedata'
import { uid } from './utils'

const STORAGE_KEY = 'office-quest-state-v2'

type Action =
  | { type: 'SWITCH_PLAYER'; player: PlayerId }
  | { type: 'ADD_QUEST'; quest: Quest }
  | { type: 'UPDATE_QUEST'; quest: Quest }
  | { type: 'DELETE_QUEST'; id: string }
  | { type: 'COMPLETE_QUEST'; id: string; by: PlayerId }
  | { type: 'REOPEN_QUEST'; id: string }
  | { type: 'TOGGLE_SUBTASK'; questId: string; subtaskId: string }
  | { type: 'ADD_PROJECT'; project: Project }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'SET_CHARACTER_NAME'; player: PlayerId; name: string }
  | { type: 'SET_APPEARANCE'; player: PlayerId; appearance: Partial<AppState['characters']['arai']['appearance']> }
  | { type: 'SET_TITLE'; player: PlayerId; title: string }
  | { type: 'CLEAR_LEVEL_UP' }
  | { type: 'CLEAR_REWARD' }
  | { type: 'START_TIME_CHALLENGE'; questId: string; mode: TimeChallengeMode; minutes: number }
  | { type: 'BUY_ITEM'; player: PlayerId; itemId: string }
  | { type: 'EQUIP_ITEM'; player: PlayerId; itemId: string }
  | { type: 'UNEQUIP_SLOT'; player: PlayerId; slot: 'hair' | 'clothes' | 'accessory' | 'effect' }
  | { type: 'TOGGLE_FAVORITE'; player: PlayerId; itemId: string }
  | { type: 'OPEN_CHEST'; chestId: string }
  | { type: 'CLAIM_DAILY'; player: PlayerId }
  | { type: 'CLAIM_WEEKLY'; player: PlayerId }
  | { type: 'CLAIM_GOAL'; player: PlayerId }
  | { type: 'SEND_PRAISE'; from: PlayerId; to: PlayerId }
  | { type: 'SEND_GIFT'; from: PlayerId; to: PlayerId; coins: number }
  | { type: 'MARK_NOTIFICATIONS_READ'; player: PlayerId }

function loadInitial(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {
    // fall through to demo state
  }
  return buildDemoState()
}

function pushNotification(state: AppState, player: PlayerId, icon: string, text: string): AppState {
  const note: AppNotification = { id: uid('note'), player, icon, text, createdAt: new Date().toISOString(), read: false }
  return { ...state, notifications: [note, ...state.notifications].slice(0, 60) }
}

function activeEventMultiplier(state: AppState, categoryId: string): number {
  const now = Date.now()
  let mult = 1
  for (const e of state.activeEvents) {
    if (new Date(e.expiresAt).getTime() < now) continue
    if (!e.categoryId || e.categoryId === categoryId) mult *= e.xpMultiplier ?? 1
  }
  return mult
}

function activeBoostMultiplier(state: AppState, player: PlayerId, kind: 'xp' | 'coins'): number {
  const now = Date.now()
  const character = state.characters[player]
  let mult = 1
  for (const b of character.boosts) {
    if (b.kind === kind && new Date(b.expiresAt).getTime() >= now) mult *= 1 + b.magnitude
  }
  return mult
}

function updateStreak(state: AppState, player: PlayerId): AppState {
  const character = state.characters[player]
  const today = todayKey()
  if (character.lastActiveDate === today) return state
  const last = character.lastActiveDate ? new Date(character.lastActiveDate) : null
  const diffDays = last ? Math.round((new Date(today).getTime() - last.getTime()) / 86400000) : 1
  let streak = character.streak
  let notifState = state
  if (diffDays <= 1) {
    streak = character.streak + 1
    notifState = pushNotification(state, player, '🔥', `Streak увеличен: ${streak} дней подряд`)
  } else {
    const hasShield = character.streakShieldUsedDate !== today
    if (hasShield && diffDays === 2) {
      notifState = pushNotification(state, player, '🛡', 'Streak Shield спас твою серию!')
    } else {
      streak = 1
    }
  }
  return {
    ...notifState,
    characters: {
      ...notifState.characters,
      [player]: { ...notifState.characters[player], streak, lastActiveDate: today },
    },
  }
}

function checkAchievements(state: AppState, player: PlayerId): AppState {
  const character = state.characters[player]
  const mine = state.quests.filter((q) => q.assignee === player || (q.assignee === 'both' && q.completedByBoth?.includes(player)))
  const completed = mine.filter((q) => q.status === 'done').length
  const byCategory: Record<string, number> = {}
  for (const q of mine) if (q.status === 'done') byCategory[q.categoryId] = (byCategory[q.categoryId] ?? 0) + 1
  const stats = {
    completed,
    byCategory,
    streak: character.streak,
    timeChallengesWon: state.quests.filter((q) => q.timeChallenge?.succeededAt).length,
    bossesDone: state.quests.filter((q) => q.difficulty === 'boss' && q.status === 'done').length,
    itemsOwned: character.inventory.length,
  }
  const newly = ACHIEVEMENTS.filter((a) => !character.unlockedAchievements.includes(a.id) && a.check(stats))
  if (newly.length === 0) return state
  let next = state
  for (const a of newly) {
    next = pushNotification(next, player, '🏆', `Achievement unlocked: ${a.title}`)
  }
  next = {
    ...next,
    characters: {
      ...next.characters,
      [player]: { ...next.characters[player], unlockedAchievements: [...character.unlockedAchievements, ...newly.map((a) => a.id)] },
    },
  }

  if (newly.some((a) => a.id === 'automation-wizard') && !next.quests.some((q) => q.id === 'q-secret-automation-dungeon')) {
    next = pushNotification(next, player, '🔓', 'Secret Quest unlocked: THE AUTOMATION DUNGEON')
    const secretQuest: Quest = {
      id: 'q-secret-automation-dungeon',
      title: 'THE AUTOMATION DUNGEON',
      description: 'Секретный квест за 25 выполненных задач по автоматизации.',
      type: 'onetime',
      categoryId: 'automation',
      priority: 'high',
      difficulty: 'epic',
      assignee: player,
      status: 'todo',
      xp: 150,
      coins: 100,
      subtasks: [],
      createdAt: new Date().toISOString(),
      secret: true,
    }
    next = { ...next, quests: [secretQuest, ...next.quests] }
  }

  return next
}

function grantXpCoins(state: AppState, player: PlayerId, xp: number, coins: number, categoryId?: string): AppState {
  let next = updateStreak(state, player)
  const character = next.characters[player]

  const eventMult = categoryId ? activeEventMultiplier(next, categoryId) : 1
  const xpBoostMult = activeBoostMultiplier(next, player, 'xp')
  const coinBoostMult = activeBoostMultiplier(next, player, 'coins')
  let critical = false
  const hasCritical = character.boosts.some((b) => b.kind === 'critical' && new Date(b.expiresAt).getTime() >= Date.now())
  if (hasCritical && Math.random() < 0.35) critical = true

  let finalXp = Math.round(xp * eventMult * xpBoostMult)
  let finalCoins = Math.round(coins * coinBoostMult)
  if (critical) {
    finalXp *= 2
    finalCoins *= 2
  }

  const newXp = character.xp + finalXp
  const newSeasonXp = character.seasonXp + finalXp
  const newLevel = levelFromXp(newXp)
  const oldLevel = levelFromXp(character.xp)
  const leveledUp = newLevel > oldLevel

  const skills = character.skills.map((s) =>
    categoryId && s.categoryId === categoryId ? { ...s, xp: s.xp + finalXp } : s,
  )

  next = {
    ...next,
    characters: {
      ...next.characters,
      [player]: {
        ...character,
        xp: newXp,
        seasonXp: newSeasonXp,
        coins: character.coins + finalCoins,
        title: leveledUp ? titleForLevel(newLevel) : character.title,
        reputation: character.reputation + 2,
        skills,
      },
    },
    lastLevelUp: leveledUp ? { player, level: newLevel } : next.lastLevelUp,
    lastReward: { xp: finalXp, coins: finalCoins, key: `${player}-${Date.now()}` },
  }

  if (leveledUp) {
    next = pushNotification(next, player, '⬆️', `Level Up! Достигнут уровень ${newLevel}`)
  }
  if (critical) {
    next = pushNotification(next, player, '🎯', 'Critical Reward! Награда удвоена')
  }

  next = checkAchievements(next, player)

  // Treasure Day-style loot: every 5th completed quest grants a mystery chest
  const totalCompleted = next.quests.filter((q) => q.status === 'done').length
  if (totalCompleted > 0 && totalCompleted % 5 === 0) {
    const chest: Chest = { id: uid('chest'), player, source: 'Every 5 quests', opened: false, createdAt: new Date().toISOString() }
    next = { ...next, chests: [chest, ...next.chests] }
    next = pushNotification(next, player, '🎁', 'Mystery Chest получен!')
  }

  // Rare event roll
  if (Math.random() < 0.05) {
    next = pushNotification(next, player, '🌈', 'Lucky Day! Следующая награда будет больше')
  }

  return next
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SWITCH_PLAYER':
      return { ...state, currentPlayer: action.player }
    case 'ADD_QUEST':
      return pushNotification({ ...state, quests: [action.quest, ...state.quests] }, action.quest.assignee === 'both' ? 'linara' : (action.quest.assignee as PlayerId), '🎯', `Новый квест: ${action.quest.title}`)
    case 'UPDATE_QUEST':
      return { ...state, quests: state.quests.map((q) => (q.id === action.quest.id ? action.quest : q)) }
    case 'DELETE_QUEST':
      return { ...state, quests: state.quests.filter((q) => q.id !== action.id) }
    case 'REOPEN_QUEST':
      return {
        ...state,
        quests: state.quests.map((q) =>
          q.id === action.id ? { ...q, status: 'todo', completedAt: undefined, completedByBoth: undefined } : q,
        ),
      }
    case 'TOGGLE_SUBTASK':
      return {
        ...state,
        quests: state.quests.map((q) =>
          q.id === action.questId
            ? { ...q, subtasks: q.subtasks.map((s) => (s.id === action.subtaskId ? { ...s, done: !s.done } : s)) }
            : q,
        ),
      }
    case 'START_TIME_CHALLENGE':
      return {
        ...state,
        quests: state.quests.map((q) =>
          q.id === action.questId
            ? { ...q, timeChallenge: { enabled: true, mode: action.mode, durationMinutes: action.minutes, startedAt: new Date().toISOString() } }
            : q,
        ),
      }
    case 'COMPLETE_QUEST': {
      const quest = state.quests.find((q) => q.id === action.id)
      if (!quest || quest.status === 'done') return state

      let bonusXp = quest.xp
      let bonusCoins = quest.coins
      let timeChallengePatch = quest.timeChallenge
      if (quest.timeChallenge?.enabled && quest.timeChallenge.startedAt && !quest.timeChallenge.succeededAt) {
        const elapsedMs = Date.now() - new Date(quest.timeChallenge.startedAt).getTime()
        const withinTime = elapsedMs <= quest.timeChallenge.durationMinutes * 60000
        if (withinTime) {
          const mult = { relaxed: 1.3, standard: 1.6, rush: 2, extreme: 3 }[quest.timeChallenge.mode]
          bonusXp = Math.round(quest.xp * mult)
          bonusCoins = Math.round(quest.coins * mult)
          timeChallengePatch = { ...quest.timeChallenge, succeededAt: new Date().toISOString() }
        } else {
          timeChallengePatch = { ...quest.timeChallenge, failedAt: new Date().toISOString() }
        }
      }

      if (quest.assignee === 'both') {
        const already = quest.completedByBoth ?? []
        if (already.includes(action.by)) return state
        const nowDone = [...already, action.by]
        const bothDone = nowDone.includes('arai') && nowDone.includes('linara')
        let next: AppState = {
          ...state,
          quests: state.quests.map((q) =>
            q.id === action.id
              ? {
                  ...q,
                  completedByBoth: nowDone,
                  status: bothDone ? 'done' : 'in_progress',
                  completedAt: bothDone ? new Date().toISOString() : undefined,
                  timeChallenge: timeChallengePatch,
                }
              : q,
          ),
        }
        const share = Math.round(bonusXp / 2)
        const coinShare = Math.round(bonusCoins / 2)
        next = grantXpCoins(next, action.by, share, coinShare, quest.categoryId)
        next = pushNotification(next, action.by, '🎉', `Квест выполнен: ${quest.title}`)
        return next
      }

      let next: AppState = {
        ...state,
        quests: state.quests.map((q) =>
          q.id === action.id ? { ...q, status: 'done', completedAt: new Date().toISOString(), timeChallenge: timeChallengePatch } : q,
        ),
      }
      next = grantXpCoins(next, action.by, bonusXp, bonusCoins, quest.categoryId)
      next = pushNotification(next, action.by, '🎉', `Квест выполнен: ${quest.title}`)
      return next
    }
    case 'ADD_PROJECT':
      return { ...state, projects: [action.project, ...state.projects] }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.category] }
    case 'SET_CHARACTER_NAME':
      return { ...state, characters: { ...state.characters, [action.player]: { ...state.characters[action.player], name: action.name } } }
    case 'SET_APPEARANCE':
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.player]: { ...state.characters[action.player], appearance: { ...state.characters[action.player].appearance, ...action.appearance } },
        },
      }
    case 'SET_TITLE':
      return { ...state, characters: { ...state.characters, [action.player]: { ...state.characters[action.player], title: action.title } } }
    case 'CLEAR_LEVEL_UP':
      return { ...state, lastLevelUp: null }
    case 'CLEAR_REWARD':
      return { ...state, lastReward: null }
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
      if (!item) return state
      const patch = item.patch
      const equipment = { ...character.equipment }
      if (item.slot !== 'furniture') (equipment as any)[item.slot] = item.id
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.player]: {
            ...character,
            equipment,
            appearance: { ...character.appearance, ...patch },
          },
        },
      }
    }
    case 'UNEQUIP_SLOT': {
      const character = state.characters[action.player]
      const equipment = { ...character.equipment }
      delete (equipment as any)[action.slot]
      return { ...state, characters: { ...state.characters, [action.player]: { ...character, equipment } } }
    }
    case 'TOGGLE_FAVORITE': {
      const character = state.characters[action.player]
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.player]: {
            ...character,
            inventory: character.inventory.map((i) => (i.itemId === action.itemId ? { ...i, favorite: !i.favorite } : i)),
          },
        },
      }
    }
    case 'OPEN_CHEST': {
      const chest = state.chests.find((c) => c.id === action.chestId)
      if (!chest || chest.opened) return state
      const rewardXp = 30 + Math.floor(Math.random() * 70)
      const rewardCoins = 20 + Math.floor(Math.random() * 60)
      const pool = SHOP_ITEMS.filter((i) => !state.characters[chest.player].inventory.some((inv) => inv.itemId === i.id))
      const itemId = pool.length > 0 && Math.random() < 0.4 ? pool[Math.floor(Math.random() * pool.length)].id : undefined
      let next: AppState = {
        ...state,
        chests: state.chests.map((c) => (c.id === action.chestId ? { ...c, opened: true, reward: { xp: rewardXp, coins: rewardCoins, itemId } } : c)),
      }
      const character = next.characters[chest.player]
      next = {
        ...next,
        characters: {
          ...next.characters,
          [chest.player]: {
            ...character,
            xp: character.xp + rewardXp,
            coins: character.coins + rewardCoins,
            inventory: itemId ? [...character.inventory, { itemId, acquiredAt: new Date().toISOString() }] : character.inventory,
          },
        },
        lastReward: { xp: rewardXp, coins: rewardCoins, key: `chest-${Date.now()}` },
      }
      if (itemId) {
        const item = SHOP_ITEMS.find((i) => i.id === itemId)
        next = pushNotification(next, chest.player, '✨', `Новый предмет: ${item?.name}`)
      }
      return next
    }
    case 'CLAIM_DAILY': {
      const character = state.characters[action.player]
      const today = todayKey()
      if (character.claimedDaily === today) return state
      let next: AppState = { ...state, characters: { ...state.characters, [action.player]: { ...character, claimedDaily: today } } }
      next = grantXpCoins(next, action.player, 100, 50)
      return next
    }
    case 'CLAIM_WEEKLY': {
      const character = state.characters[action.player]
      const wk = todayKey()
      if (character.claimedWeekly === wk) return state
      let next: AppState = { ...state, characters: { ...state.characters, [action.player]: { ...character, claimedWeekly: wk } } }
      next = grantXpCoins(next, action.player, 250, 120)
      return next
    }
    case 'CLAIM_GOAL': {
      const character = state.characters[action.player]
      const mk = new Date().toISOString().slice(0, 7)
      if (character.claimedGoal === mk) return state
      let next: AppState = { ...state, characters: { ...state.characters, [action.player]: { ...character, claimedGoal: mk } } }
      next = grantXpCoins(next, action.player, 300, 150)
      return next
    }
    case 'SEND_PRAISE': {
      let next = pushNotification(state, action.to, '🎉', `${state.characters[action.from].name} похвалила тебя: Great job!`)
      const toChar = next.characters[action.to]
      next = { ...next, characters: { ...next.characters, [action.to]: { ...toChar, coins: toChar.coins + 10 } } }
      return next
    }
    case 'SEND_GIFT': {
      const fromChar = state.characters[action.from]
      if (fromChar.coins < action.coins) return state
      let next: AppState = {
        ...state,
        characters: {
          ...state.characters,
          [action.from]: { ...fromChar, coins: fromChar.coins - action.coins },
        },
      }
      const toChar = next.characters[action.to]
      next = { ...next, characters: { ...next.characters, [action.to]: { ...toChar, coins: toChar.coins + action.coins } } }
      next = pushNotification(next, action.to, '🎁', `${state.characters[action.from].name} отправила подарок: +${action.coins} Coins`)
      return next
    }
    case 'MARK_NOTIFICATIONS_READ':
      return { ...state, notifications: state.notifications.map((n) => (n.player === action.player ? { ...n, read: true } : n)) }
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
