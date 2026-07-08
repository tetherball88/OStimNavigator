import { CSSProperties, useEffect, useRef, useState } from 'react'
import { useNavigatorStore } from './store/index'
import { SceneTable } from './components/SceneTable/SceneTable'
import { closeNavigatorView } from './services/gameIntegration'

const DEV = import.meta.env.DEV

function App() {
  const visible = useNavigatorStore(state => state.visible)

  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      setPressedKey(e.key)
      hideTimer.current = setTimeout(() => setPressedKey(null), 1500)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (!visible) return null

  const style: CSSProperties = DEV
    ? { backgroundImage: 'url("./assets/background.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }
    : {}

  return (
    <div className="ui-container" style={style}>
      <div className="navigator-panel prism-panel">
        <div className="navigator-header">
          <div className="navigator-title">OStim Navigator</div>
          <button className="navigator-close-btn" onClick={closeNavigatorView} title="Close">✕</button>
        </div>
        {pressedKey && (
          <div className="key-badge">
            <span className="key-badge-label">KEY</span>
            <kbd className="key-badge-key">{pressedKey}</kbd>
          </div>
        )}
        <SceneTable />
      </div>
      
    </div>
  )
}

export default App
