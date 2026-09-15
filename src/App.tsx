import { StoreProvider, useStore } from './store'
import { LoginScreen } from './components/LoginScreen'
import { CharacterCreatorScreen } from './components/CharacterCreatorScreen'
import { GameWorld } from './components/GameWorld'
import { LevelUpOverlay, RewardToast } from './components/Overlays'

function Shell() {
  const { state } = useStore()

  if (!state.currentPlayer) return <LoginScreen />

  const character = state.characters[state.currentPlayer]
  if (!character.createdCharacter) return <CharacterCreatorScreen player={state.currentPlayer} />

  return (
    <>
      <GameWorld />
      <LevelUpOverlay />
      <RewardToast />
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
