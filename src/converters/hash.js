const CRYPTO_UNAVAILABLE_ERROR = '(Web Crypto API is not available in this runtime)'
const SUBTLE_UNAVAILABLE_ERROR = '(Web Crypto SubtleCrypto API is not available in this runtime)'

function getSubtleApi() {
  if (typeof globalThis === 'undefined' || !globalThis.crypto) {
    return { error: CRYPTO_UNAVAILABLE_ERROR }
  }
  if (!globalThis.crypto.subtle || typeof globalThis.crypto.subtle.digest !== 'function') {
    return { error: SUBTLE_UNAVAILABLE_ERROR }
  }
  return { subtle: globalThis.crypto.subtle }
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function digest(algorithm, input) {
  const { subtle, error } = getSubtleApi()
  if (error) return error
  try {
    const data = new TextEncoder().encode(input)
    const hash = await subtle.digest(algorithm, data)
    return toHex(hash)
  } catch (e) {
    return `(failed to generate ${algorithm} hash: ${e?.message || 'unsupported or unavailable algorithm'})`
  }
}

export const hashConverters = [
  {
    id: 'sha1',
    name: 'SHA-1',
    category: 'hash',
    description: 'Generate SHA-1 hash',
    convert: (input) => digest('SHA-1', input),
  },
  {
    id: 'sha256',
    name: 'SHA-256',
    category: 'hash',
    description: 'Generate SHA-256 hash',
    convert: (input) => digest('SHA-256', input),
  },
  {
    id: 'sha384',
    name: 'SHA-384',
    category: 'hash',
    description: 'Generate SHA-384 hash',
    convert: (input) => digest('SHA-384', input),
  },
  {
    id: 'sha512',
    name: 'SHA-512',
    category: 'hash',
    description: 'Generate SHA-512 hash',
    convert: (input) => digest('SHA-512', input),
  },
  {
    id: 'sha224',
    name: 'SHA-224',
    category: 'hash',
    description: 'Generate SHA-224 hash',
    convert: (input) => digest('SHA-224', input),
  },
  {
    id: 'all-hashes',
    name: 'All Hashes',
    category: 'hash',
    description: 'Generate SHA-1, SHA-224, SHA-256, SHA-384, and SHA-512 hashes all at once',
    convert: async (input) => {
      const [sha1, sha224, sha256, sha384, sha512] = await Promise.all([
        digest('SHA-1', input),
        digest('SHA-224', input),
        digest('SHA-256', input),
        digest('SHA-384', input),
        digest('SHA-512', input),
      ])
      return [
        `SHA-1:   ${sha1}`,
        `SHA-224: ${sha224}`,
        `SHA-256: ${sha256}`,
        `SHA-384: ${sha384}`,
        `SHA-512: ${sha512}`,
      ].join('\n')
    },
  },
]
