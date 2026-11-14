import { CSSProperties, useEffect, useRef, useState } from 'react'
import { useNavigatorStore } from './store/index'
import { SceneTable } from './components/SceneTable/SceneTable'
import { closeNavigatorView, notifyTextFocus } from './services/gameIntegration'
import { getNormalizedKeyCode } from './utils/keys'
import { convertKeyboardEventToScanCode } from './utils/scanCodeMap'

const DEV = import.meta.env.DEV

function getIsTextInput(): boolean {
  const activeEl = document.activeElement
  return (
    activeEl instanceof HTMLInputElement ||
    activeEl instanceof HTMLTextAreaElement ||
    activeEl instanceof HTMLSelectElement ||
    !!(activeEl instanceof HTMLElement && (activeEl.isContentEditable || activeEl.closest('.monaco-editor')))
  )
}

function App() {
  const visible = useNavigatorStore(state => state.visible)

  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const forwardedDownScanCodes = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!visible) {
      notifyTextFocus(false)
    }
  }, [visible])

  useEffect(() => {
    let lastOpen = false
    const checkModal = () => {
      const open = document.querySelector('.preset-modal-backdrop, .gen-modal-backdrop') !== null
      if (open !== lastOpen) {
        lastOpen = open
        window.setModalOpen?.(open ? 'true' : 'false')
      }
    }
    const observer = new MutationObserver(checkModal)
    observer.observe(document.body, { childList: true, subtree: true })
    checkModal()
    return () => {
      observer.disconnect()
      if (lastOpen) {
        window.setModalOpen?.('false')
      }
    }
  }, [])

  useEffect(() => {
    let focusOutTimer: ReturnType<typeof setTimeout> | null = null

    function clearFocusOutTimer() {
      if (focusOutTimer !== null) {
        clearTimeout(focusOutTimer)
        focusOutTimer = null
      }
    }

    function onFocusIn() {
      clearFocusOutTimer()
      notifyTextFocus(getIsTextInput())
    }

    function onFocusOut() {
      clearFocusOutTimer()
      focusOutTimer = setTimeout(() => {
        focusOutTimer = null
        notifyTextFocus(getIsTextInput())
      }, 0)
    }

    function onWindowBlur() {
      clearFocusOutTimer()
      notifyTextFocus(false)
      releaseAllForwardedKeys()
    }

    function releaseAllForwardedKeys() {
      if (forwardedDownScanCodes.current.size === 0) return
      for (const scanCode of forwardedDownScanCodes.current) {
        window.forwardKey?.(JSON.stringify({ scanCode, isDown: false }))
      }
      forwardedDownScanCodes.current.clear()
    }

    function onKeyDown(e: KeyboardEvent) {
      const isTextInput = getIsTextInput()
      const keyCode = getNormalizedKeyCode(e)

      if (!e.repeat) {
        const toggleKey = useNavigatorStore.getState().toggleNavigatorKey
        if (!isTextInput && toggleKey > 0 && keyCode === toggleKey) {
          e.preventDefault()
          window.toggleFocus?.()
          return
        }

        if (!isTextInput) {
          if (e.key === 'Escape' && document.querySelector('.preset-modal-backdrop')) {
            return
          }
          const scanCode = convertKeyboardEventToScanCode(e, keyCode)
          if (scanCode > 0) {
            forwardedDownScanCodes.current.add(scanCode)
            window.forwardKey?.(JSON.stringify({ scanCode, isDown: true }))
          }
        }
      }
      if (hideTimer.current) clearTimeout(hideTimer.current)
      setPressedKey(e.key)
      hideTimer.current = setTimeout(() => setPressedKey(null), 1500)
    }

    function onKeyUp(e: KeyboardEvent) {
      const keyCode = getNormalizedKeyCode(e)
      const scanCode = convertKeyboardEventToScanCode(e, keyCode)
      if (scanCode > 0 && forwardedDownScanCodes.current.has(scanCode)) {
        forwardedDownScanCodes.current.delete(scanCode)
        window.forwardKey?.(JSON.stringify({ scanCode, isDown: false }))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('focusin', onFocusIn)
    window.addEventListener('focusout', onFocusOut)
    window.addEventListener('blur', onWindowBlur)
    return () => {
      clearFocusOutTimer()
      notifyTextFocus(false)
      releaseAllForwardedKeys()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('focusin', onFocusIn)
      window.removeEventListener('focusout', onFocusOut)
      window.removeEventListener('blur', onWindowBlur)
    }
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
