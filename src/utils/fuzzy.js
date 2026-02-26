/**
 * Simple fuzzy matching — checks if all characters of the query
 * appear in order within the target string. Returns a score
 * (higher is better, 0 means no match).
 */
export function fuzzyMatch(query, target) {
  const q = query.toLowerCase()
  const t = target.toLowerCase()

  // Exact substring match gets highest score
  if (t.includes(q)) return 100 + (q.length / t.length) * 50

  // Word-start match (each query char starts a word)
  let qi = 0
  let score = 0
  let consecutive = 0
  let lastIdx = -2

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++
      // Bonus for consecutive matches
      if (ti === lastIdx + 1) {
        consecutive++
        score += consecutive * 2
      } else {
        consecutive = 0
      }
      // Bonus for matching at word boundary
      if (ti === 0 || t[ti - 1] === ' ' || t[ti - 1] === '-' || t[ti - 1] === '_') {
        score += 5
      }
      score += 1
      lastIdx = ti
    }
  }

  // All query chars must be found
  if (qi < q.length) return 0

  // Normalize by query length
  return score
}

/**
 * Filter and sort items by fuzzy match quality.
 * Returns items that match, sorted by best match first.
 */
export function fuzzyFilter(query, items, getTexts) {
  if (!query.trim()) return items

  const scored = items.map(item => {
    const texts = getTexts(item)
    const best = Math.max(...texts.map(t => fuzzyMatch(query, t)))
    return { item, score: best }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.item)
}
