import { useEffect } from 'react'
import './KeyboardHelp.css'

const shortcuts = [
  { group: 'Convert Panel' },
  { keys: ['⌘', 'L'], desc: 'Focus input field' },
  { keys: ['⌘', '⇧', 'S'], desc: 'Swap from ↔ to' },
  { keys: ['⌘', '⇧', 'C'], desc: 'Copy output' },
  { keys: ['⌘', '⇧', 'X'], desc: 'Clear input' },
  { keys: ['⌘', 'B'], desc: 'Toggle batch mode' },
  { keys: ['Esc'], desc: 'Back to format mode' },
  { group: 'Global' },
  { keys: ['⌘', 'D'], desc: 'Toggle dark/light theme' },
  { keys: ['?'], desc: 'This help' },
]

function KeyboardHelp({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="kb-backdrop" onClick={onClose}>
      <div className="kb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kb-title">Keyboard Shortcuts</div>
        <div className="kb-list">
          {shortcuts.map((s, i) => (
            s.group ? (
              <div key={i} className="kb-group-label">{s.group}</div>
            ) : (
              <div key={i} className="kb-row">
                <div className="kb-keys">
                  {s.keys.map((k, j) => (
                    <span key={j}>
                      <kbd className="kb-key">{k}</kbd>
                      {j < s.keys.length - 1 && <span className="kb-plus">+</span>}
                    </span>
                  ))}
                </div>
                <span className="kb-desc">{s.desc}</span>
              </div>
            )
          ))}
        </div>
        <div className="kb-footer">Press <kbd className="kb-key">?</kbd> or <kbd className="kb-key">Esc</kbd> to close</div>
      </div>
    </div>
  )
}

export default KeyboardHelp
