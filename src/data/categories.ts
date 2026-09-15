import type { Category } from '../types'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'recruiting', name: 'Рекрутинг', icon: '👤', color: '#60a5fa' },
  { id: 'office', name: 'Офисные задачи', icon: '🏢', color: '#a78bfa' },
  { id: 'partners', name: 'Партнёрские задачи', icon: '🤝', color: '#f472b6' },
  { id: 'events', name: 'Мероприятия', icon: '🎉', color: '#fb923c' },
  { id: 'congrats', name: 'Внутренние поздравления', icon: '🎂', color: '#f87171' },
  { id: 'automation', name: 'Автоматизация', icon: '⚙️', color: '#34d399' },
  { id: 'surveys', name: 'Опросы', icon: '📊', color: '#38bdf8' },
  { id: 'training', name: 'Обучения', icon: '🎓', color: '#facc15' },
  { id: 'meetings', name: 'Оперативки / встречи', icon: '🗣️', color: '#c084fc' },
  { id: 'onboarding', name: 'Онбординг', icon: '🌱', color: '#4ade80' },
  { id: 'other', name: 'Другое', icon: '📦', color: '#94a3b8' },
]
