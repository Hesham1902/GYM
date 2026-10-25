import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'
import { applyDir } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { setupServiceWorker } from '@/pwa'
import { watchStandaloneViewport } from '@/utils/viewport'

applyDir(useSettings.getState().language)
if (navigator.storage?.persist) navigator.storage.persist().catch(() => {})
setupServiceWorker()
watchStandaloneViewport()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
