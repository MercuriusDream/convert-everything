import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { ToastProvider } from './components/Toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
    const swUrl = `${normalizedBaseUrl}sw.js`

    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.warn('[SW] Service worker registration failed:', error)
    })
  })
}
