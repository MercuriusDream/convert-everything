// File hashing and crypto-related converters

const CRYPTO_UNAVAILABLE_ERROR = '(Web Crypto API is not available in this runtime)'
const SUBTLE_UNAVAILABLE_ERROR = '(Web Crypto SubtleCrypto API is not available in this runtime)'
const RANDOM_UNAVAILABLE_ERROR = '(Web Crypto random values API is not available in this runtime)'

function getCryptoApi() {
  if (typeof globalThis === 'undefined' || !globalThis.crypto) return null
  return globalThis.crypto
}

function getSubtleApi() {
  const cryptoApi = getCryptoApi()
  if (!cryptoApi) return { error: CRYPTO_UNAVAILABLE_ERROR }
  if (!cryptoApi.subtle || typeof cryptoApi.subtle.digest !== 'function') {
    return { error: SUBTLE_UNAVAILABLE_ERROR }
  }
  return { subtle: cryptoApi.subtle }
}

function getRandomApi() {
  const cryptoApi = getCryptoApi()
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') {
    return { error: RANDOM_UNAVAILABLE_ERROR }
  }
  return { cryptoApi }
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function bytesToBase64(bytes) {
  if (typeof btoa !== 'function') return null
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

function randomUuidV4(cryptoApi) {
  if (typeof cryptoApi.randomUUID === 'function') return cryptoApi.randomUUID()
  if (typeof cryptoApi.getRandomValues !== 'function') return null

  const bytes = new Uint8Array(16)
  cryptoApi.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-')
}

export const cryptoConverters = [
  {
    id: 'file-sha256',
    name: 'File SHA-256',
    category: 'hash',
    description: 'Calculate SHA-256 hash of any file',
    acceptsFile: true,
    acceptTypes: '*',
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files
      const { subtle, error } = getSubtleApi()
      if (error) return { text: error }
      try {
        const buffer = await file.arrayBuffer()
        const hash = await subtle.digest('SHA-256', buffer)
        return { text: `${file.name}\nSHA-256: ${toHex(hash)}` }
      } catch (e) {
        const message = e && e.message ? e.message : 'unknown error'
        return { text: `(failed to calculate SHA-256: ${message})` }
      }
    },
  },
  {
    id: 'file-sha512',
    name: 'File SHA-512',
    category: 'hash',
    description: 'Calculate SHA-512 hash of any file',
    acceptsFile: true,
    acceptTypes: '*',
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files
      const { subtle, error } = getSubtleApi()
      if (error) return { text: error }
      try {
        const buffer = await file.arrayBuffer()
        const hash = await subtle.digest('SHA-512', buffer)
        return { text: `${file.name}\nSHA-512: ${toHex(hash)}` }
      } catch (e) {
        const message = e && e.message ? e.message : 'unknown error'
        return { text: `(failed to calculate SHA-512: ${message})` }
      }
    },
  },
  {
    id: 'random-password',
    name: 'Password Generator',
    category: 'utility',
    description: 'Generate a random password — enter length (default 16)',
    convert: (input) => {
      const len = Math.max(4, Math.min(128, parseInt(input.trim()) || 16))
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+'
      const { cryptoApi, error } = getRandomApi()
      if (error) return error
      const arr = new Uint32Array(len)
      cryptoApi.getRandomValues(arr)
      return Array.from(arr, (v) => chars[v % chars.length]).join('')
    },
  },
  {
    id: 'random-hex',
    name: 'Random Hex Generator',
    category: 'utility',
    description: 'Generate random hex string — enter byte count (default 32)',
    convert: (input) => {
      const bytes = Math.max(1, Math.min(1024, parseInt(input.trim()) || 32))
      const { cryptoApi, error } = getRandomApi()
      if (error) return error
      const arr = new Uint8Array(bytes)
      cryptoApi.getRandomValues(arr)
      return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('')
    },
  },
  {
    id: 'random-base64',
    name: 'Random Base64 Generator',
    category: 'utility',
    description: 'Generate random Base64 string — enter byte count (default 32)',
    convert: (input) => {
      const bytes = Math.max(1, Math.min(1024, parseInt(input.trim()) || 32))
      const { cryptoApi, error } = getRandomApi()
      if (error) return error
      const arr = new Uint8Array(bytes)
      cryptoApi.getRandomValues(arr)
      const encoded = bytesToBase64(arr)
      if (encoded === null) return '(Base64 encoding is not available in this runtime)'
      return encoded
    },
  },
  {
    id: 'random-uuid-bulk',
    name: 'Bulk UUID Generator',
    category: 'utility',
    description: 'Generate multiple UUIDs — enter count (default 10)',
    convert: (input) => {
      const count = Math.max(1, Math.min(100, parseInt(input.trim()) || 10))
      const { cryptoApi, error } = getRandomApi()
      if (error) return error
      const uuids = []
      for (let i = 0; i < count; i++) {
        const uuid = randomUuidV4(cryptoApi)
        if (!uuid) return '(UUID generation is not available in this runtime)'
        uuids.push(uuid)
      }
      return uuids.join('\n')
    },
  },
  {
    id: 'text-hash-all',
    name: 'Text → All Hashes',
    category: 'hash',
    description: 'Calculate SHA-1, SHA-256, SHA-384, SHA-512 hashes of text at once',
    convert: async (input) => {
      const { subtle, error } = getSubtleApi()
      if (error) return error
      try {
        const data = new TextEncoder().encode(input)
        const [sha1, sha256, sha384, sha512] = await Promise.all([
          subtle.digest('SHA-1', data),
          subtle.digest('SHA-256', data),
          subtle.digest('SHA-384', data),
          subtle.digest('SHA-512', data),
        ])
        return [
          `SHA-1:   ${toHex(sha1)}`,
          `SHA-256: ${toHex(sha256)}`,
          `SHA-384: ${toHex(sha384)}`,
          `SHA-512: ${toHex(sha512)}`,
        ].join('\n')
      } catch (e) {
        const message = e && e.message ? e.message : 'unknown error'
        return `(failed to calculate hashes: ${message})`
      }
    },
  },
  {
    id: 'checksum-all',
    name: 'All Hashes',
    category: 'hash',
    description: 'Calculate all hash types (MD5, SHA-1, SHA-256, SHA-512) at once',
    acceptsFile: true,
    acceptTypes: '*',
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files
      const { subtle, error } = getSubtleApi()
      if (error) return { text: error }
      try {
        const buffer = await file.arrayBuffer()
        const [sha1, sha256, sha512] = await Promise.all([
          subtle.digest('SHA-1', buffer),
          subtle.digest('SHA-256', buffer),
          subtle.digest('SHA-512', buffer),
        ])
        return {
          text: [
            `File: ${file.name}`,
            `Size: ${file.size} bytes`,
            '',
            `SHA-1:   ${toHex(sha1)}`,
            `SHA-256: ${toHex(sha256)}`,
            `SHA-512: ${toHex(sha512)}`,
          ].join('\n')
        }
      } catch (e) {
        const message = e && e.message ? e.message : 'unknown error'
        return { text: `(failed to calculate file hashes: ${message})` }
      }
    },
  },
  {
    id: 'hash-compare',
    name: 'Hash Compare',
    category: 'hash',
    description: 'Compare two hash values — paste them on separate lines',
    placeholder: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3\na94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim().toLowerCase()).filter(Boolean)
      if (lines.length < 2) return '(paste two hashes, one per line)'
      const a = lines[0]
      const b = lines[1]

      // detect algorithm by length
      const algoGuess = (h) => {
        const len = h.length
        if (len === 32) return 'MD5'
        if (len === 40) return 'SHA-1'
        if (len === 56) return 'SHA-224'
        if (len === 64) return 'SHA-256'
        if (len === 96) return 'SHA-384'
        if (len === 128) return 'SHA-512'
        return `Unknown (${len} hex chars)`
      }

      const match = a === b

      let result = [
        `Hash A: ${a}`,
        `  Algorithm: ${algoGuess(a)}`,
        '',
        `Hash B: ${b}`,
        `  Algorithm: ${algoGuess(b)}`,
        '',
        match ? 'Result: MATCH — hashes are identical' : 'Result: NO MATCH — hashes differ',
      ]

      if (!match && a.length === b.length) {
        let diffCount = 0
        let diffPositions = []
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) { diffCount++; diffPositions.push(i) }
        }
        result.push(`  Differences: ${diffCount} character(s) at position(s): ${diffPositions.slice(0, 20).join(', ')}${diffPositions.length > 20 ? '...' : ''}`)
      }
      if (a.length !== b.length) {
        result.push(`  Length difference: ${a.length} vs ${b.length} characters`)
      }

      return result.join('\n')
    },
  },
  {
    id: 'hmac-gen',
    name: 'HMAC Generator',
    category: 'hash',
    description: 'Generate HMAC — first line: secret key, rest: message. Computes SHA-256 and SHA-512.',
    placeholder: 'my-secret-key\n---\nHello World',
    convert: async (input) => {
      const sep = input.indexOf('\n---\n')
      let key, message
      if (sep !== -1) {
        key = input.slice(0, sep)
        message = input.slice(sep + 5)
      } else {
        const lines = input.split('\n')
        key = lines[0] || ''
        message = lines.slice(1).join('\n')
      }
      if (!key) return '(first line: secret key, then --- separator, then message)'
      if (!message) return '(add a message after the key)'

      const { subtle, error } = getSubtleApi()
      if (error) return error

      const enc = new TextEncoder()
      const keyData = enc.encode(key)
      const msgData = enc.encode(message)
      const results = []
      try {
        for (const algo of ['SHA-256', 'SHA-512']) {
          const cryptoKey = await subtle.importKey('raw', keyData, { name: 'HMAC', hash: algo }, false, ['sign'])
          const sig = await subtle.sign('HMAC', cryptoKey, msgData)
          results.push(`HMAC-${algo}: ${toHex(sig)}`)
        }
      } catch (e) {
        const message = e && e.message ? e.message : 'unknown error'
        return `(failed to generate HMAC: ${message})`
      }

      return [
        `Key:     ${key.slice(0, 50)}${key.length > 50 ? '...' : ''}`,
        `Message: ${message.slice(0, 80)}${message.length > 80 ? '...' : ''}`,
        '',
        ...results,
      ].join('\n')
    },
  },
  {
    id: 'xor-cipher',
    name: 'XOR Cipher',
    category: 'encode',
    description: 'Encrypt/decrypt with XOR cipher — first line: key, rest: message (or hex for decrypt)',
    placeholder: 'mysecret\n---\nHello World',
    convert: (input) => {
      const sep = input.indexOf('\n---\n')
      let key, message
      if (sep !== -1) {
        key = input.slice(0, sep)
        message = input.slice(sep + 5)
      } else {
        const lines = input.split('\n')
        key = lines[0] || ''
        message = lines.slice(1).join('\n')
      }
      if (!key) return '(first line: key, then --- separator, then message)'
      if (!message) return '(add message after the key)'

      // Check if input is hex (for decryption)
      const isHex = /^[0-9a-fA-F\s]+$/.test(message.trim()) && message.trim().length > 0
      let inputBytes

      if (isHex) {
        const hexStr = message.trim().replace(/\s+/g, '')
        inputBytes = new Uint8Array(hexStr.match(/.{2}/g).map(h => parseInt(h, 16)))
      } else {
        inputBytes = new TextEncoder().encode(message)
      }

      const keyBytes = new TextEncoder().encode(key)
      const output = new Uint8Array(inputBytes.length)
      for (let i = 0; i < inputBytes.length; i++) {
        output[i] = inputBytes[i] ^ keyBytes[i % keyBytes.length]
      }

      const hexOutput = Array.from(output).map(b => b.toString(16).padStart(2, '0')).join(' ')
      let textOutput
      try { textOutput = new TextDecoder('utf-8', { fatal: true }).decode(output) } catch { textOutput = '(binary — use hex output)' }

      return [
        `Key: ${key}`,
        `Mode: ${isHex ? 'Decrypt (hex input)' : 'Encrypt'}`,
        '',
        `Hex output:`,
        `  ${hexOutput}`,
        '',
        `Text output:`,
        `  ${textOutput}`,
      ].join('\n')
    },
  },
  {
    id: 'crc32-calc',
    name: 'CRC-32 Calculator',
    category: 'hash',
    description: 'Calculate CRC-32 checksum (used in ZIP, PNG, Ethernet)',
    convert: (input) => {
      // Generate CRC-32 lookup table
      const table = new Uint32Array(256)
      for (let i = 0; i < 256; i++) {
        let c = i
        for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
        table[i] = c
      }
      const bytes = new TextEncoder().encode(input)
      let crc = 0xFFFFFFFF
      for (const byte of bytes) crc = table[(crc ^ byte) & 0xFF] ^ (crc >>> 8)
      crc = (crc ^ 0xFFFFFFFF) >>> 0
      return [
        `CRC-32: 0x${crc.toString(16).toUpperCase().padStart(8, '0')}`,
        `Decimal: ${crc}`,
        `Signed: ${crc > 0x7FFFFFFF ? crc - 0x100000000 : crc}`,
        '',
        `Input: ${input.slice(0, 50)}${input.length > 50 ? '...' : ''}`,
        `Bytes: ${bytes.length}`,
      ].join('\n')
    },
  },
  {
    id: 'adler32-calc',
    name: 'Adler-32 Calculator',
    category: 'hash',
    description: 'Calculate Adler-32 checksum (used in zlib/Deflate format)',
    convert: (input) => {
      const bytes = new TextEncoder().encode(input)
      const MOD_ADLER = 65521
      let a = 1, b = 0
      for (const byte of bytes) {
        a = (a + byte) % MOD_ADLER
        b = (b + a) % MOD_ADLER
      }
      const checksum = ((b << 16) | a) >>> 0
      return [
        `Adler-32: 0x${checksum.toString(16).toUpperCase().padStart(8, '0')}`,
        `Decimal: ${checksum}`,
        `A: ${a}  B: ${b}`,
        '',
        `Input: ${input.slice(0, 50)}${input.length > 50 ? '...' : ''}`,
        `Bytes: ${bytes.length}`,
      ].join('\n')
    },
  },
]
