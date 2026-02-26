import { useState, useCallback, useRef } from 'react'
import { ToastContext } from '../hooks/useToast'
import './Toast.css'

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null)
  const timerRef = useRef(null)

  const toast = useCallback((msg) => {
    clearTimeout(timerRef.current)
    setMessage(msg)
    timerRef.current = setTimeout(() => setMessage(null), 1500)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {message && (
        <div className="toast" role="status" aria-live="polite">{message}</div>
      )}
    </ToastContext.Provider>
  )
}
