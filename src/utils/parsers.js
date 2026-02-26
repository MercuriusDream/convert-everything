export function yamlToJson(yaml) {
  const lines = yaml.split('\n')
  const result = {}
  let currentKey = null
  for (const line of lines) {
    const trimmed = line.trimEnd()
    if (!trimmed || trimmed.startsWith('#')) continue
    const arrayMatch = trimmed.match(/^(\s*)- (.*)$/)
    if (arrayMatch) {
      if (currentKey && !Array.isArray(result[currentKey])) result[currentKey] = []
      if (currentKey) result[currentKey].push(parseYamlValue(arrayMatch[2]))
      continue
    }
    const kvMatch = trimmed.match(/^(\s*)([^:]+):\s*(.*)$/)
    if (kvMatch) {
      const key = kvMatch[2].trim()
      const val = kvMatch[3].trim()
      currentKey = key
      if (val) {
        result[key] = parseYamlValue(val)
      } else {
        result[key] = {}
      }
    }
  }
  return JSON.stringify(result, null, 2)
}

export function parseYamlValue(s) {
  if (s === 'true' || s === 'True') return true
  if (s === 'false' || s === 'False') return false
  if (s === 'null' || s === 'Null' || s === '~') return null
  if (/^-?\d+$/.test(s)) return parseInt(s, 10)
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s)
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1)
  return s
}

export function objToYaml(val, indent) {
  const prefix = '  '.repeat(indent)
  if (val === null) return 'null'
  if (typeof val === 'boolean') return String(val)
  if (typeof val === 'number') return String(val)
  if (typeof val === 'string') {
    if (val.includes('\n') || val.includes(':') || val.includes('#')) return `"${val.replace(/"/g, '\\"')}"`
    return val
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]'
    return val.map(item => {
      if (typeof item === 'object' && item !== null) {
        const inner = objToYaml(item, indent + 1)
        const firstLine = inner.split('\n')[0]
        const rest = inner.split('\n').slice(1).map(l => prefix + '  ' + l).join('\n')
        return `${prefix}- ${firstLine}${rest ? '\n' + rest : ''}`
      }
      return `${prefix}- ${objToYaml(item, indent + 1)}`
    }).join('\n')
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val)
    if (entries.length === 0) return '{}'
    return entries.map(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        return `${prefix}${k}:\n${objToYaml(v, indent + 1)}`
      }
      return `${prefix}${k}: ${objToYaml(v, indent + 1)}`
    }).join('\n')
  }
  return String(val)
}

export function parseToml(input) {
  const result = {}
  let currentSection = result
  for (const line of input.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/)
    if (sectionMatch) {
      const path = sectionMatch[1].split('.')
      currentSection = result
      for (const key of path) { if (!currentSection[key]) currentSection[key] = {}; currentSection = currentSection[key] }
      continue
    }
    const kvMatch = trimmed.match(/^([^=]+)=\s*(.+)$/)
    if (kvMatch) {
      const key = kvMatch[1].trim()
      let val = kvMatch[2].trim()
      if (val === 'true') currentSection[key] = true
      else if (val === 'false') currentSection[key] = false
      else if (/^-?\d+$/.test(val)) currentSection[key] = parseInt(val)
      else if (/^-?\d+\.\d+$/.test(val)) currentSection[key] = parseFloat(val)
      else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) currentSection[key] = val.slice(1, -1)
      else if (val.startsWith('[') && val.endsWith(']')) { try { currentSection[key] = JSON.parse(val) } catch { currentSection[key] = val } }
      else currentSection[key] = val
    }
  }
  return result
}
