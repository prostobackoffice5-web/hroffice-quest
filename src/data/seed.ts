import type { AppState, Character, Project, Quest } from '../types'
import { DEFAULT_CATEGORIES } from './categories'
import { levelFromXp, titleForLevel, todayKey } from './engine'
import { defaultSkills } from './gamedata'

function makeCharacter(
  id: 'arai' | 'linara',
  name: string,
  role: 'owner' | 'member',
  xp: number,
  coins: number,
  streak: number,
  emoji: string,
  outfitColor: string,
  inventory: string[] = [],
  equipment: Character['equipment'] = {},
): Character {
  return {
    id,
    name,
    role,
    title: titleForLevel(levelFromXp(xp)),
    appearance: {
      emoji,
      skinColor: '#f2c9a1',
      hairColor: '#4a3728',
      outfitColor,
      accessory: 'none',
    },
    xp,
    seasonXp: Math.round(xp * 0.4),
    coins,
    streak,
    lastActiveDate: todayKey(),
    createdCharacter: true,
    equipment,
    inventory: inventory.map((itemId) => ({ itemId, acquiredAt: new Date().toISOString() })),
    boosts: [],
    skills: defaultSkills(),
    unlockedAchievements: ['first-quest'],
    reputation: role === 'owner' ? 120 : 60,
    onboardingDone: true,
  }
}

export function buildDemoState(): AppState {
  const now = new Date()
  const iso = (d: Date) => d.toISOString()
  const today = new Date(now)
  const inDays = (n: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() + n)
    return iso(d)
  }

  const project: Project = {
    id: 'proj-hr-automation',
    title: 'HR Automation',
    icon: '🏰',
    ownerId: 'arai',
    participants: ['arai', 'linara'],
    createdAt: iso(today),
  }

  const quests: Quest[] = [
    // Project subtasks
    {
      id: 'q-proj-1', title: 'Изучить текущий процесс', type: 'project', categoryId: 'automation',
      priority: 'medium', difficulty: 'normal', assignee: 'arai', status: 'done',
      xp: 25, coins: 15, projectId: project.id, subtasks: [], completedAt: iso(today), createdAt: iso(today),
    },
    {
      id: 'q-proj-2', title: 'Собрать требования', type: 'project', categoryId: 'automation',
      priority: 'medium', difficulty: 'normal', assignee: 'arai', status: 'done',
      xp: 25, coins: 15, projectId: project.id, subtasks: [], completedAt: iso(today), createdAt: iso(today),
    },
    {
      id: 'q-proj-3', title: 'Создать структуру', type: 'project', categoryId: 'automation',
      priority: 'high', difficulty: 'hard', assignee: 'both', status: 'done',
      xp: 50, coins: 30, projectId: project.id, subtasks: [], completedAt: iso(today), createdAt: iso(today),
    },
    {
      id: 'q-proj-4', title: 'Протестировать', type: 'project', categoryId: 'automation',
      priority: 'high', difficulty: 'hard', assignee: 'linara', status: 'todo',
      xp: 50, coins: 30, projectId: project.id, subtasks: [], createdAt: iso(today),
    },
    {
      id: 'q-proj-5', title: 'Внедрить', type: 'project', categoryId: 'automation',
      priority: 'urgent', difficulty: 'epic', assignee: 'arai', status: 'todo',
      xp: 100, coins: 70, projectId: project.id, subtasks: [], createdAt: iso(today), deadline: inDays(5),
    },
    // Boss quest
    {
      id: 'q-boss-1', title: 'Подготовить новую систему онбординга', type: 'onetime', categoryId: 'onboarding',
      priority: 'urgent', difficulty: 'boss', assignee: 'arai', status: 'todo',
      xp: 300, coins: 200, subtasks: [
        { id: 's1', title: 'Собрать программу welcome day', done: true },
        { id: 's2', title: 'Подготовить материалы', done: false },
        { id: 's3', title: 'Согласовать с руководителями', done: false },
      ], createdAt: iso(today), deadline: inDays(10),
    },
    // Daily quests for Arai
    {
      id: 'q-arai-d1', title: 'Проверить отклики', type: 'daily', categoryId: 'recruiting',
      priority: 'medium', difficulty: 'easy', assignee: 'arai', status: 'done',
      xp: 10, coins: 5, subtasks: [], completedAt: iso(today), createdAt: iso(today),
    },
    {
      id: 'q-arai-d2', title: 'Разобрать сообщения', type: 'daily', categoryId: 'office',
      priority: 'low', difficulty: 'easy', assignee: 'arai', status: 'done',
      xp: 10, coins: 5, subtasks: [], completedAt: iso(today), createdAt: iso(today),
    },
    {
      id: 'q-arai-d3', title: 'Обновить статусы кандидатов', type: 'daily', categoryId: 'recruiting',
      priority: 'medium', difficulty: 'normal', assignee: 'arai', status: 'todo',
      xp: 25, coins: 15, subtasks: [], createdAt: iso(today),
    },
    {
      id: 'q-arai-w1', title: 'Провести 1:1 с Линарой', type: 'weekly', categoryId: 'meetings',
      priority: 'high', difficulty: 'normal', assignee: 'arai', status: 'todo',
      xp: 25, coins: 15, subtasks: [], createdAt: iso(today), deadline: inDays(3),
    },
    // Linara quests
    {
      id: 'q-lin-1', title: 'Подготовить список кандидатов', type: 'onetime', categoryId: 'recruiting',
      priority: 'urgent', difficulty: 'hard', assignee: 'linara', status: 'todo',
      xp: 50, coins: 30, subtasks: [], createdAt: iso(today), deadline: inDays(1),
    },
    {
      id: 'q-lin-2', title: 'Обновить таблицу адаптации', type: 'daily', categoryId: 'onboarding',
      priority: 'medium', difficulty: 'normal', assignee: 'linara', status: 'todo',
      xp: 25, coins: 15, subtasks: [], createdAt: iso(today),
    },
    {
      id: 'q-lin-3', title: 'Подготовить материалы к обучению', type: 'daily', categoryId: 'training',
      priority: 'low', difficulty: 'easy', assignee: 'linara', status: 'done',
      xp: 10, coins: 5, subtasks: [], completedAt: iso(today), createdAt: iso(today),
    },
    // Co-op-ish quest assigned to both
    {
      id: 'q-both-1', title: 'Подготовить обучение по сервисной культуре', type: 'weekly', categoryId: 'training',
      priority: 'medium', difficulty: 'hard', assignee: 'both', status: 'in_progress',
      xp: 50, coins: 30, subtasks: [
        { id: 'cs1', title: 'Структура (Арай)', done: true },
        { id: 'cs2', title: 'Материалы (Линара)', done: false },
      ], createdAt: iso(today), deadline: inDays(7),
    },
  ]

  const seasonEnds = new Date(now)
  seasonEnds.setDate(seasonEnds.getDate() + 30)

  return {
    characters: {
      arai: makeCharacter('arai', 'Арай', 'owner', 3850, 1840, 14, '👑', '#f59e0b', ['hair-gold', 'outfit-royal', 'acc-crown', 'furn-desk'], { hair: 'hair-gold', clothes: 'outfit-royal', accessory: 'acc-crown' }),
      linara: makeCharacter('linara', 'Линара', 'member', 1150, 740, 8, '🌱', '#22c55e', ['hair-frost', 'furn-plant'], { hair: 'hair-frost' }),
    },
    categories: DEFAULT_CATEGORIES,
    quests,
    projects: [project],
    currentPlayer: 'arai',
    lastLevelUp: null,
    lastReward: null,
    activeEvents: [
      {
        id: 'evt-1',
        key: 'automation_rush',
        title: 'AUTOMATION RUSH',
        icon: '⚡',
        description: 'Все задачи категории «Автоматизация» дают +30% XP',
        expiresAt: (() => { const d = new Date(now); d.setMinutes(d.getMinutes() + 24 * 60 + 35); return iso(d) })(),
        categoryId: 'automation',
        xpMultiplier: 1.3,
      },
    ],
    chests: [],
    notifications: [],
    worldLevel: 4,
    seasonId: 'SEASON 01 — THE FIRST CHAPTER',
    seasonEndsAt: iso(seasonEnds),
  }
}
