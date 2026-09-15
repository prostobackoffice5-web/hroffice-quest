import type { Category } from '../types'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'general', name: 'Общее', color: '#8b9dc3' },
  { id: 'recruiting', name: 'Рекрутинг', color: '#60a5fa' },
  { id: 'office', name: 'Офис', color: '#a78bfa' },
  { id: 'partners', name: 'Партнёры', color: '#f472b6' },
  { id: 'events', name: 'Мероприятия', color: '#fb923c' },
  { id: 'automation', name: 'Автоматизация', color: '#34d399' },
  { id: 'training', name: 'Обучение', color: '#facc15' },
  { id: 'onboarding', name: 'Онбординг', color: '#4ade80' },
]

export const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: 'Низкий', color: '#4ade80' },
  medium: { label: 'Средний', color: '#facc15' },
  high: { label: 'Высокий', color: '#fb923c' },
  urgent: { label: 'Срочный', color: '#f87171' },
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Легко',
  medium: 'Средне',
  hard: 'Сложно',
}
