import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { useNavigatorStore } from './store/index'
import { setupGameIntegration } from './services/gameIntegration'
import { mockScenes } from './services/mockData'

const store = useNavigatorStore.getState()
setupGameIntegration(store)

if (import.meta.env.DEV) {
  store.setVisible(true)
  store.setScenes(mockScenes)
  store.setCurrentSceneId(mockScenes[0].id)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
