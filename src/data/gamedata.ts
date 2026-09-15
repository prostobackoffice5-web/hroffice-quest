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
