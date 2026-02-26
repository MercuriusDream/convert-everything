const KEY = 'convert-everything-history'
const MAX = 30
const CHANGE_EVENT = 'history-change'

function notifyChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export { CHANGE_EVENT }

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function addHistoryEntry(fromId, toId, inputPreview, outputPreview) {
  const history = getHistory()

  // Don't add duplicate of most recent
  if (history.length > 0) {
    const last = history[0]
    if (last.from === fromId && last.to === toId && last.input === inputPreview) {
      // Update output if different
      if (last.output !== outputPreview) {
        history[0] = { ...last, output: outputPreview, ts: Date.now() }
        localStorage.setItem(KEY, JSON.stringify(history))
        notifyChange()
      }
      return
    }
  }

  history.unshift({
    from: fromId,
    to: toId,
    input: inputPreview,
    output: outputPreview,
    ts: Date.now(),
  })

  if (history.length > MAX) history.length = MAX

  localStorage.setItem(KEY, JSON.stringify(history))
  notifyChange()
}

export function removeHistoryEntry(index) {
  const history = getHistory()
  if (index >= 0 && index < history.length) {
    history.splice(index, 1)
    localStorage.setItem(KEY, JSON.stringify(history))
    notifyChange()
  }
}

export function clearHistory() {
  localStorage.removeItem(KEY)
  notifyChange()
}
