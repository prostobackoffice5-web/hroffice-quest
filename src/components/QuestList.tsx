import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useStore } from '../store'
import { QuestCard } from './QuestCard'
import { QuestModal } from './QuestModal'
import type { Quest } from '../types'

export function QuestList() {
  const { state } = useStore()
  const [editing, setEditing] = useState<Quest | null | undefined>(undefined)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'active' | 'done' | 'all'>('active')
  const [assigneeFilter, setAssigneeFilter] = useState<'mine' | 'all'>('mine')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'list' | 'kanban'>('list')

  const quests = useMemo(() => {
    return state.quests
      .filter((q) => !q.projectId)
      .filter((q) => (categoryFilter === 'all' ? true : q.categoryId === categoryFilter))
      .filter((q) => (priorityFilter === 'all' ? true : q.priority === priorityFilter))
      .filter((q) => (view === 'kanban' ? true : statusFilter === 'all' ? true : statusFilter === 'done' ? q.status === 'done' : q.status !== 'done'))
      .filter((q) => (assigneeFilter === 'all' ? true : q.assignee === state.currentPlayer || q.assignee === 'both'))
      .filter((q) => q.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [state.quests, categoryFilter, priorityFilter, statusFilter, assigneeFilter, search, state.currentPlayer, view])

  const columns: { key: Quest['status']; label: string }[] = [
    { key: 'todo', label: 'Todo' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'done', label: 'Completed' },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 flex-1 min-w-[160px]">
          <Search size={15} className="text-purple-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск квестов..."
            className="bg-transparent outline-none text-sm text-white placeholder:text-purple-300/50 w-full"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="text-sm rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-purple-100 outline-none">
          <option value="all" className="bg-[#241a40]">Все категории</option>
          {state.categories.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#241a40]">{c.icon} {c.name}</option>
          ))}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="text-sm rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-purple-100 outline-none">
          <option value="all" className="bg-[#241a40]">Все приоритеты</option>
          <option value="low" className="bg-[#241a40]">🟢 Low</option>
          <option value="medium" className="bg-[#241a40]">🟡 Medium</option>
          <option value="high" className="bg-[#241a40]">🟠 High</option>
          <option value="urgent" className="bg-[#241a40]">🔴 Urgent</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="text-sm rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-purple-100 outline-none">
          <option value="active" className="bg-[#241a40]">Активные</option>
          <option value="done" className="bg-[#241a40]">Завершённые</option>
          <option value="all" className="bg-[#241a40]">Все</option>
        </select>
        <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value as any)} className="text-sm rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-purple-100 outline-none">
          <option value="mine" className="bg-[#241a40]">Мои квесты</option>
          <option value="all" className="bg-[#241a40]">Все квесты</option>
        </select>
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(['list', 'kanban'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-sm px-2.5 py-1 rounded-md capitalize ${view === v ? 'bg-fuchsia-500 text-white' : 'text-purple-200 hover:bg-white/10'}`}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          onClick={() => setEditing(null)}
          className="flex items-center gap-1 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-sm font-semibold px-3 py-1.5"
        >
          <Plus size={16} /> New Quest
        </button>
      </div>

      {view === 'list' ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {quests.map((q) => (
            <QuestCard key={q.id} quest={q} onEdit={(qq) => setEditing(qq)} />
          ))}
          {quests.length === 0 && <div className="text-purple-300/60 text-sm col-span-2 text-center py-10">Квестов не найдено</div>}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.key} className="space-y-2">
              <div className="text-xs font-semibold text-purple-300 uppercase px-1">{col.label} · {quests.filter((q) => q.status === col.key).length}</div>
              <div className="space-y-2">
                {quests.filter((q) => q.status === col.key).map((q) => (
                  <QuestCard key={q.id} quest={q} onEdit={(qq) => setEditing(qq)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== undefined && <QuestModal quest={editing} onClose={() => setEditing(undefined)} />}
    </div>
  )
}
