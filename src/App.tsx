import { useState } from 'react'
import { StoreProvider, useStore } from './store'
import { Dashboard } from './components/Dashboard'
import { QuestList } from './components/QuestList'
import { Projects } from './components/Projects'
import { Players } from './components/Players'
import { CharacterCreator } from './components/CharacterCreator'
import { LevelUpOverlay, RewardToast } from './components/Overlays'
import { Notifications } from './components/Notifications'
import { ChestButton } from './components/ChestModal'
import { Shop } from './components/Shop'
import { Inventory } from './components/Inventory'
import { Skills } from './components/Skills'
import { Achievements } from './components/Achievements'
import { Statistics } from './components/Statistics'
import { Calendar } from './components/Calendar'
import { Room } from './components/Room'

type Tab = 'dashboard' | 'quests' | 'projects' | 'calendar' | 'shop' | 'inventory' | 'skills' | 'achievements' | 'statistics' | 'room' | 'players' | 'character'

const TABS: { id: Tab; label: string; icon: string; ownerOnly?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'quests', label: 'Quests', icon: '📜' },
  { id: 'projects', label: 'Projects', icon: '🏰' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'shop', label: 'Shop', icon: '🛒' },
  { id: 'inventory', label: 'Inventory', icon: '🎒' },
  { id: 'skills', label: 'Skills', icon: '🧠' },
  { id: 'achievements', label: 'Achievements', icon: '🏆' },
  { id: 'statistics', label: 'Stats', icon: '📊' },
  { id: 'room', label: 'Room', icon: '🏠' },
  { id: 'players', label: 'Players', icon: '👥', ownerOnly: true },
  { id: 'character', label: 'Character', icon: '🎨' },
]

function TopBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const { state, dispatch } = useStore()
  const isOwner = state.characters[state.currentPlayer].role === 'owner'

  return (
    <div className="sticky top-0 z-40 bg-[#1b1230]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-white font-black tracking-wide text-lg">🎮 OFFICE QUEST</div>
        <div className="flex items-center gap-2">
          <ChestButton />
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {(['arai', 'linara'] as const).map((p) => (
              <button
                key={p}
                onClick={() => dispatch({ type: 'SWITCH_PLAYER', player: p })}
                className={`text-sm px-3 py-1.5 rounded-md transition ${
                  state.currentPlayer === p ? 'bg-fuchsia-500 text-white' : 'text-purple-200 hover:bg-white/10'
                }`}
              >
                {state.characters[p].appearance.emoji} {state.characters[p].name}
              </button>
            ))}
          </div>
          <Notifications />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 pb-2 flex gap-1 overflow-x-auto">
        {TABS.filter((t) => !t.ownerOnly || isOwner).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-sm px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              tab === t.id ? 'bg-white/15 text-white font-semibold' : 'text-purple-300 hover:bg-white/5'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Shell() {
  const [tab, setTab] = useState<Tab>('dashboard')
  return (
    <div className="min-h-screen">
      <TopBar tab={tab} setTab={setTab} />
      <main className="max-w-4xl mx-auto px-4 py-5">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'quests' && <QuestList />}
        {tab === 'projects' && <Projects />}
        {tab === 'calendar' && <Calendar />}
        {tab === 'shop' && <Shop />}
        {tab === 'inventory' && <Inventory />}
        {tab === 'skills' && <Skills />}
        {tab === 'achievements' && <Achievements />}
        {tab === 'statistics' && <Statistics />}
        {tab === 'room' && <Room />}
        {tab === 'players' && <Players />}
        {tab === 'character' && <CharacterCreator />}
      </main>
      <LevelUpOverlay />
      <RewardToast />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
