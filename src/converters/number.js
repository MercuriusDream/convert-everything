export const numberConverters = [
  {
    id: 'dec-to-hex',
    name: 'Decimal to Hex',
    category: 'number',
    description: 'Convert decimal number to hexadecimal',
    convert: (input) => {
      const n = parseInt(input.trim(), 10)
      if (isNaN(n)) return '(invalid number)'
      return '0x' + n.toString(16).toUpperCase()
    },
  },
  {
    id: 'hex-to-dec',
    name: 'Hex to Decimal',
    category: 'number',
    description: 'Convert hexadecimal to decimal',
    convert: (input) => {
      const cleaned = input.trim().replace(/^0x/i, '')
      const n = parseInt(cleaned, 16)
      if (isNaN(n)) return '(invalid hex)'
      return String(n)
    },
  },
  {
    id: 'dec-to-bin',
    name: 'Decimal to Binary',
    category: 'number',
    description: 'Convert decimal number to binary',
    convert: (input) => {
      const n = parseInt(input.trim(), 10)
      if (isNaN(n)) return '(invalid number)'
      return '0b' + n.toString(2)
    },
  },
  {
    id: 'bin-to-dec',
    name: 'Binary to Decimal',
    category: 'number',
    description: 'Convert binary to decimal',
    convert: (input) => {
      const cleaned = input.trim().replace(/^0b/i, '')
      const n = parseInt(cleaned, 2)
      if (isNaN(n)) return '(invalid binary)'
      return String(n)
    },
  },
  {
    id: 'dec-to-oct',
    name: 'Decimal to Octal',
    category: 'number',
    description: 'Convert decimal number to octal',
    convert: (input) => {
      const n = parseInt(input.trim(), 10)
      if (isNaN(n)) return '(invalid number)'
      return '0o' + n.toString(8)
    },
  },
  {
    id: 'oct-to-dec',
    name: 'Octal to Decimal',
    category: 'number',
    description: 'Convert octal to decimal',
    convert: (input) => {
      const cleaned = input.trim().replace(/^0o/i, '')
      const n = parseInt(cleaned, 8)
      if (isNaN(n)) return '(invalid octal)'
      return String(n)
    },
  },
  {
    id: 'dec-to-roman',
    name: 'Decimal to Roman',
    category: 'number',
    description: 'Convert decimal number to Roman numerals (1-3999)',
    convert: (input) => {
      const n = parseInt(input.trim(), 10)
      if (isNaN(n) || n < 1 || n > 3999) return '(enter a number between 1 and 3999)'
      const vals = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
      let r = '', num = n
      for (const [v, s] of vals) { while (num >= v) { r += s; num -= v } }
      return r
    },
  },
  {
    id: 'roman-to-dec',
    name: 'Roman to Decimal',
    category: 'number',
    description: 'Convert Roman numerals to decimal',
    convert: (input) => {
      const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 }
      let result = 0
      const upper = input.trim().toUpperCase()
      for (let i = 0; i < upper.length; i++) {
        const cur = map[upper[i]]
        if (!cur) return `(invalid character: ${upper[i]})`
        const next = map[upper[i + 1]] || 0
        if (cur < next) result -= cur; else result += cur
      }
      return String(result)
    },
  },
  {
    id: 'number-base',
    name: 'Base Converter',
    category: 'number',
    description: 'Convert number between any bases (2-36) — format: number:fromBase:toBase',
    convert: (input) => {
      const parts = input.trim().split(':')
      if (parts.length !== 3) return '(format: number:fromBase:toBase — e.g. FF:16:10)'
      const [numStr, fromBase, toBase] = parts
      const fb = parseInt(fromBase)
      const tb = parseInt(toBase)
      if (isNaN(fb) || isNaN(tb) || fb < 2 || fb > 36 || tb < 2 || tb > 36) return '(bases must be 2-36)'
      try {
        const dec = parseInt(numStr, fb)
        if (isNaN(dec)) return '(invalid number for given base)'
        return dec.toString(tb).toUpperCase()
      } catch {
        return '(conversion error)'
      }
    },
  },
  {
    id: 'bytes-format',
    name: 'Bytes Formatter',
    category: 'number',
    description: 'Convert bytes to human-readable size (KB, MB, GB, etc.)',
    convert: (input) => {
      const n = Number(input.trim())
      if (isNaN(n)) return '(enter a number of bytes)'
      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      let size = n, unit = 0
      while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit++ }
      return [
        `${n} bytes`,
        `= ${size.toFixed(2)} ${units[unit]}`,
        '',
        `Bits: ${n * 8}`,
        `KB: ${(n / 1024).toFixed(4)}`,
        `MB: ${(n / (1024 * 1024)).toFixed(6)}`,
        `GB: ${(n / (1024 * 1024 * 1024)).toFixed(8)}`,
      ].join('\n')
    },
  },
  {
    id: 'scientific-notation',
    name: 'Scientific Notation',
    category: 'number',
    description: 'Convert between decimal and scientific notation (e.g. 1234567 ↔ 1.234567 × 10⁶)',
    convert: (input) => {
      const s = input.trim()
      if (!s) return ''
      const supMap = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻','+':'' }
      const toSup = (n) => String(n).replace(/[+]/g, '').split('').map(c => supMap[c] ?? c).join('')
      const n = parseFloat(s)
      if (isNaN(n)) return '(invalid number)'
      if (n === 0) return 'Decimal: 0\nScientific: 0 × 10⁰\nEngineering: 0e+0'
      const exp = Math.floor(Math.log10(Math.abs(n)))
      const coeff = n / Math.pow(10, exp)
      const engExp = Math.floor(exp / 3) * 3
      const engCoeff = n / Math.pow(10, engExp)
      return [
        `Decimal:     ${s}`,
        `Scientific:  ${coeff.toPrecision(6).replace(/\.?0+$/, '')} × 10${toSup(exp)}`,
        `Engineering: ${engCoeff.toPrecision(6).replace(/\.?0+$/, '')} × 10${toSup(engExp)}`,
        `E-notation:  ${n.toExponential(6).replace(/\.?0+e/, 'e')}`,
      ].join('\n')
    },
  },
  {
    id: 'fraction-decimal',
    name: 'Fraction ↔ Decimal',
    category: 'number',
    description: 'Convert fractions to decimals and decimals to fractions (e.g. 3/4 or 0.75)',
    convert: (input) => {
      const s = input.trim()
      if (!s) return ''
      if (s.includes('/')) {
        const parts = s.split('/')
        if (parts.length !== 2) return '(format: numerator/denominator, e.g. 3/4)'
        const num = parseFloat(parts[0].trim())
        const den = parseFloat(parts[1].trim())
        if (isNaN(num) || isNaN(den)) return '(invalid numbers)'
        if (den === 0) return '(division by zero)'
        const decimal = num / den
        return [
          `Fraction: ${num}/${den}`,
          `Decimal:  ${decimal}`,
          `Percent:  ${(decimal * 100).toFixed(6).replace(/\.?0+$/, '')}%`,
        ].join('\n')
      }
      const decimal = parseFloat(s)
      if (isNaN(decimal)) return '(enter a decimal like 0.75 or a fraction like 3/4)'
      function gcd(a, b) { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { [a, b] = [b, a % b] } return a }
      const precision = 1e-9
      let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = Math.abs(decimal)
      for (let i = 0; i < 64; i++) {
        const a = Math.floor(b)
        ;[h1, h2] = [a * h1 + h2, h1]
        ;[k1, k2] = [a * k1 + k2, k1]
        if (Math.abs(b - a) < 1e-12) break
        b = 1 / (b - a)
        if (Math.abs(decimal - (decimal < 0 ? -h1 : h1) / k1) < precision) break
      }
      const sign = decimal < 0 ? '-' : ''
      const g = gcd(h1, k1)
      return [
        `Decimal:  ${decimal}`,
        `Fraction: ${sign}${h1 / g}/${k1 / g}`,
        `Percent:  ${(decimal * 100).toFixed(6).replace(/\.?0+$/, '')}%`,
      ].join('\n')
    },
  },
  {
    id: 'prime-check',
    name: 'Prime Checker',
    category: 'number',
    description: 'Check if a number is prime and find nearby primes',
    convert: (input) => {
      const n = parseInt(input.trim(), 10)
      if (isNaN(n) || n < 0) return '(enter a positive integer)'
      if (n < 2) return `${n} is NOT prime\nSmallest prime: 2`
      function isPrime(num) {
        if (num < 2) return false
        if (num === 2) return true
        if (num % 2 === 0) return false
        for (let i = 3; i <= Math.sqrt(num); i += 2) {
          if (num % i === 0) return false
        }
        return true
      }
      function nextPrime(start) {
        let candidate = start + 1
        while (!isPrime(candidate)) candidate++
        return candidate
      }
      function prevPrime(start) {
        if (start <= 2) return null
        let candidate = start - 1
        while (candidate >= 2 && !isPrime(candidate)) candidate--
        return candidate >= 2 ? candidate : null
      }
      const prime = isPrime(n)
      // Factorization
      let factors = []
      if (!prime && n > 1) {
        let num = n
        for (let f = 2; f * f <= num; f++) {
          while (num % f === 0) { factors.push(f); num = Math.floor(num / f) }
        }
        if (num > 1) factors.push(num)
      }
      const prev = prevPrime(n)
      const next = nextPrime(n)
      return [
        `${n} is ${prime ? 'PRIME' : 'NOT prime'}`,
        '',
        ...(prime ? [] : [`Factors: ${factors.join(' × ')}`]),
        `Previous prime: ${prev ?? 'none'}`,
        `Next prime:     ${next}`,
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci Sequence',
    category: 'number',
    description: 'Generate Fibonacci numbers up to N terms or find which term a number is',
    placeholder: '10',
    convert: (input) => {
      const s = input.trim()
      const n = parseInt(s, 10)
      if (isNaN(n) || n < 1) return '(enter a positive integer for number of terms, or a Fibonacci number)'
      if (n > 100) return '(enter up to 100 terms)'
      const seq = [0n, 1n]
      while (seq.length < n) seq.push(seq[seq.length - 1] + seq[seq.length - 2])
      const result = seq.slice(0, n)
      return [
        `First ${n} Fibonacci numbers:`,
        result.map((v, i) => `F(${i}) = ${v}`).join('\n'),
      ].join('\n')
    },
  },
  {
    id: 'gcd-lcm',
    name: 'GCD & LCM',
    category: 'number',
    description: 'Calculate GCD and LCM of two or more numbers (comma or space separated)',
    placeholder: '12, 18, 24',
    convert: (input) => {
      const nums = input.split(/[\s,]+/).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0)
      if (nums.length < 2) return '(enter at least two positive integers)'
      function gcd(a, b) { while (b) { [a, b] = [b, a % b] } return a }
      function lcm(a, b) { return Math.abs(a * b) / gcd(a, b) }
      const g = nums.reduce(gcd)
      const l = nums.reduce(lcm)
      return [
        `Numbers: ${nums.join(', ')}`,
        '',
        `GCD: ${g}`,
        `LCM: ${l}`,
        '',
        `${nums.join(' × ')} / GCD(${nums.join(', ')}) = LCM`,
      ].join('\n')
    },
  },
  {
    id: 'collatz',
    name: 'Collatz Sequence',
    category: 'number',
    description: 'Generate the Collatz (3n+1) sequence for any positive integer',
    placeholder: '27',
    convert: (input) => {
      const n = parseInt(input.trim(), 10)
      if (isNaN(n) || n < 1) return '(enter a positive integer)'
      if (n > 1e15) return '(number too large)'
      const seq = [n]
      let current = n
      while (current !== 1) {
        current = current % 2 === 0 ? current / 2 : 3 * current + 1
        seq.push(current)
        if (seq.length > 10000) return '(sequence too long — stopping at 10000 steps)'
      }
      const max = Math.max(...seq)
      return [
        `Starting number: ${n}`,
        `Steps to reach 1: ${seq.length - 1}`,
        `Maximum value: ${max} (at step ${seq.indexOf(max)})`,
        '',
        seq.length <= 50 ? seq.join(' → ') : seq.slice(0, 25).join(' → ') + ` ... (${seq.length - 50} more) ... ` + seq.slice(-25).join(' → '),
      ].join('\n')
    },
  },
  {
    id: 'integer-overflow',
    name: 'Integer Overflow Checker',
    category: 'number',
    description: 'Check if a number fits in common integer types (int8, int16, int32, int64, uint8, etc.)',
    placeholder: '2147483647',
    convert: (input) => {
      const s = input.trim()
      const n = parseInt(s, 10)
      if (isNaN(n)) return '(enter an integer)'
      const types = [
        { name: 'int8',   min: -128,                max: 127,                size: '1 byte' },
        { name: 'uint8',  min: 0,                   max: 255,                size: '1 byte' },
        { name: 'int16',  min: -32768,              max: 32767,              size: '2 bytes' },
        { name: 'uint16', min: 0,                   max: 65535,              size: '2 bytes' },
        { name: 'int32',  min: -2147483648,         max: 2147483647,         size: '4 bytes' },
        { name: 'uint32', min: 0,                   max: 4294967295,         size: '4 bytes' },
        { name: 'int64',  min: -9223372036854775808, max: 9223372036854775807, size: '8 bytes' },
        { name: 'uint64', min: 0,                   max: 18446744073709551615, size: '8 bytes' },
      ]
      return types.map(({ name, min, max, size }) => {
        const fits = n >= min && n <= max
        return `${name.padEnd(7)} (${size}): ${fits ? '✓ fits' : '✗ overflow'}`
      }).join('\n')
    },
  },
  {
    id: 'number-sequence',
    name: 'Number Sequence',
    category: 'number',
    description: 'Generate arithmetic or geometric sequences — format: "start step count" or "start *ratio count"',
    placeholder: '1 2 10',
    convert: (input) => {
      const s = input.trim()
      const geoMatch = s.match(/^([\d.e+\-]+)\s+\*([\d.e+\-]+)\s+(\d+)$/)
      if (geoMatch) {
        const start = parseFloat(geoMatch[1]), ratio = parseFloat(geoMatch[2]), count = parseInt(geoMatch[3], 10)
        if (isNaN(start) || isNaN(ratio) || isNaN(count) || count < 1 || count > 100) return '(format: "start *ratio count" e.g. "2 *3 6" for 2,6,18,54,162,486)'
        const seq = Array.from({ length: count }, (_, i) => parseFloat((start * Math.pow(ratio, i)).toPrecision(8)))
        return [
          `Geometric: start=${start}, ratio=${ratio}, count=${count}`,
          seq.join(', '),
          '',
          `Sum: ${seq.reduce((a, b) => a + b, 0).toPrecision(8)}`,
        ].join('\n')
      }
      const parts = s.split(/\s+/)
      if (parts.length === 3) {
        const [startStr, stepStr, countStr] = parts
        const start = parseFloat(startStr), step = parseFloat(stepStr), count = parseInt(countStr, 10)
        if (isNaN(start) || isNaN(step) || isNaN(count) || count < 1 || count > 1000) return '(format: "start step count" e.g. "1 2 10" → 1,3,5,7,9,11,13,15,17,19)'
        const seq = Array.from({ length: count }, (_, i) => parseFloat((start + step * i).toPrecision(10)))
        const display = seq.length > 20 ? seq.slice(0, 20).join(', ') + ` ... (${seq.length} total)` : seq.join(', ')
        return [
          `Arithmetic: start=${start}, step=${step}, count=${count}`,
          display,
          '',
          `Sum:  ${seq.reduce((a, b) => a + b, 0)}`,
          `Last: ${seq[seq.length - 1]}`,
        ].join('\n')
      }
      return '(format: "start step count" for arithmetic, or "start *ratio count" for geometric)'
    },
  },
  {
    id: 'modular-arithmetic',
    name: 'Modular Arithmetic',
    category: 'number',
    description: 'Compute modular operations — format: "a mod m" or "a^b mod m" or "a^-1 mod m" (modular inverse)',
    placeholder: '7^5 mod 13',
    convert: (input) => {
      const s = input.trim()
      // Modular inverse: a^-1 mod m
      let m = s.match(/^(-?\d+)\^-1\s*mod\s*(\d+)$/i)
      if (m) {
        const a = parseInt(m[1], 10), mod = parseInt(m[2], 10)
        function modInverse(a, m) {
          const m0 = m
          let x0 = 0n, x1 = 1n
          let a0 = BigInt(((a % m) + m) % m), m0b = BigInt(m)
          if (m0b === 1n) return 0
          while (a0 > 1n) {
            const q = a0 / m0b
            ;[a0, m0b] = [m0b, a0 % m0b]
            ;[x1, x0] = [x1 - q * x0, x1]
          }
          return x1 < 0n ? x1 + BigInt(m) : x1
        }
        if (mod <= 1) return '(modulus must be > 1)'
        try {
          const inv = modInverse(a, mod)
          return [
            `${a}^(-1) mod ${mod} = ${inv}`,
            `Verify: ${a} × ${inv} mod ${mod} = ${(BigInt(a) * inv) % BigInt(mod)}`,
          ].join('\n')
        } catch { return '(modular inverse does not exist — a and m must be coprime)' }
      }
      // Modular exponentiation: a^b mod m
      m = s.match(/^(-?\d+)\^(\d+)\s*mod\s*(\d+)$/i)
      if (m) {
        const base = BigInt(m[1]), exp = BigInt(m[2]), mod = BigInt(m[3])
        if (mod <= 0n) return '(modulus must be positive)'
        let result = 1n, b = ((base % mod) + mod) % mod
        let e = exp
        while (e > 0n) { if (e % 2n === 1n) result = result * b % mod; b = b * b % mod; e >>= 1n }
        return `${m[1]}^${m[2]} mod ${m[3]} = ${result}`
      }
      // Simple mod: a mod m
      m = s.match(/^(-?\d+)\s*mod\s*(\d+)$/i)
      if (m) {
        const a = parseInt(m[1], 10), mod = parseInt(m[2], 10)
        if (mod <= 0) return '(modulus must be positive)'
        const rem = ((a % mod) + mod) % mod
        return [
          `${a} mod ${mod} = ${rem}`,
          `Quotient: ${Math.trunc(a / mod)}`,
          `Remainder: ${a % mod} (JavaScript %)`,
          `True mod (always positive): ${rem}`,
        ].join('\n')
      }
      return '(format: "a mod m", "a^b mod m", or "a^-1 mod m")'
    },
  },
  {
    id: 'prime-factorization',
    name: 'Prime Factorization',
    category: 'number',
    description: 'Factor a number into its prime factors',
    placeholder: '360',
    convert: (input) => {
      const n = parseInt(input.trim(), 10)
      if (isNaN(n) || n < 2) return '(enter a positive integer ≥ 2)'
      if (n > 1e12) return '(too large — max 10^12)'
      let rem = n
      const factors = {}
      for (let p = 2; p * p <= rem; p++) {
        while (rem % p === 0) {
          factors[p] = (factors[p] || 0) + 1
          rem = Math.floor(rem / p)
        }
      }
      if (rem > 1) factors[rem] = (factors[rem] || 0) + 1
      const primes = Object.keys(factors).map(Number)
      const expanded = primes.map(p => Array(factors[p]).fill(p)).flat()
      const exponents = primes.map(p => factors[p] > 1 ? `${p}^${factors[p]}` : `${p}`)
      return [
        `${n} = ${exponents.join(' × ')}`,
        `Expanded: ${expanded.join(' × ')}`,
        `Prime factors: ${primes.join(', ')}`,
        `Total prime factors (with multiplicity): ${expanded.length}`,
        `Distinct prime factors: ${primes.length}`,
        `Number of divisors: ${primes.reduce((acc, p) => acc * (factors[p] + 1), 1)}`,
      ].join('\n')
    },
  },
  {
    id: 'digit-ops',
    name: 'Digit Sum & Root',
    category: 'number',
    description: 'Calculate digit sum, digital root, alternating sum, and product of digits',
    placeholder: '9875',
    convert: (input) => {
      const s = input.trim().replace(/^-/, '')
      if (!/^\d+$/.test(s)) return '(enter a positive integer)'
      const digits = s.split('').map(Number)
      const sum = digits.reduce((a, b) => a + b, 0)
      const product = digits.reduce((a, b) => a * b, 1)
      const altSum = digits.reduce((acc, d, i) => i % 2 === 0 ? acc + d : acc - d, 0)
      let root = sum
      while (root >= 10) root = root.toString().split('').map(Number).reduce((a, b) => a + b, 0)
      const reverseNum = parseInt(s.split('').reverse().join(''), 10)
      const isPalin = s === s.split('').reverse().join('')
      return [
        `Number: ${input.trim()}`,
        `Digits: ${digits.join(' + ')} = ${sum}`,
        `Digital root: ${root}`,
        `Digit product: ${digits.join(' × ')} = ${product}`,
        `Alternating sum: ${sum} → ${altSum} (divisibility by 11: ${Math.abs(altSum) % 11 === 0 ? 'yes' : 'no'})`,
        `Reversed: ${reverseNum}`,
        `Palindrome: ${isPalin ? 'yes' : 'no'}`,
        `Digit count: ${digits.length}`,
      ].join('\n')
    },
  },
  {
    id: 'fibonacci-gen',
    name: 'Fibonacci Sequence',
    category: 'number',
    description: 'Generate Fibonacci numbers — enter count (default 15) or "nth" for the nth number',
    placeholder: '15',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      const nthMatch = s.match(/^(\d+)(?:st|nd|rd|th)?$/)
      if (!nthMatch) return '(enter a count like "15" or "20")'
      const n = parseInt(nthMatch[1], 10)
      if (n < 1) return '(enter a positive number)'
      if (n > 80) return '(max 80 to avoid precision loss)'
      const fibs = [0n, 1n]
      while (fibs.length < n) fibs.push(fibs[fibs.length - 1] + fibs[fibs.length - 2])
      const seq = fibs.slice(0, n)
      return [
        `First ${n} Fibonacci numbers:`,
        seq.map((f, i) => `  F(${i}) = ${f}`).join('\n'),
        '',
        `F(${n - 1}) = ${seq[seq.length - 1]}`,
        seq.length >= 2 ? `Golden ratio approx: ${(Number(seq[seq.length - 1]) / Number(seq[seq.length - 2])).toFixed(10)}` : '',
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'ieee754',
    name: 'IEEE 754 Float Inspector',
    category: 'number',
    description: 'Show the binary IEEE 754 representation of a floating-point number',
    placeholder: '3.14',
    convert: (input) => {
      const n = parseFloat(input.trim())
      if (isNaN(n)) return '(enter a valid number)'
      // Get float64 bits
      const buf = new ArrayBuffer(8)
      const view = new DataView(buf)
      view.setFloat64(0, n, false)
      const hi = view.getUint32(0, false), lo = view.getUint32(4, false)
      const bits = (hi >>> 0).toString(2).padStart(32, '0') + (lo >>> 0).toString(2).padStart(32, '0')
      const sign = bits[0]
      const exp = bits.slice(1, 12)
      const mant = bits.slice(12)
      const expVal = parseInt(exp, 2)
      const expBias = expVal - 1023
      const isSpecial = expVal === 2047
      const isZero = expVal === 0 && parseInt(mant, 2) === 0
      return [
        `Value: ${n}`,
        '',
        `64-bit (double precision):`,
        `  Sign:     ${sign}  (${sign === '0' ? 'positive' : 'negative'})`,
        `  Exponent: ${exp}  (${expVal} - 1023 bias = ${expBias})`,
        `  Mantissa: ${mant}`,
        '',
        `Binary: ${bits.slice(0,1)} ${bits.slice(1,12)} ${bits.slice(12)}`,
        `Hex:    ${hi.toString(16).padStart(8,'0').toUpperCase()} ${lo.toString(16).padStart(8,'0').toUpperCase()}`,
        '',
        isZero ? 'Type: Zero' :
        isSpecial && parseInt(mant, 2) === 0 ? `Type: ${sign === '0' ? '+' : '-'}Infinity` :
        isSpecial ? 'Type: NaN' :
        expVal === 0 ? 'Type: Subnormal (denormalized)' :
        `Type: Normal`,
        `Precision: ~${Math.abs(n) > 1e-300 && Math.abs(n) < 1e300 ? Math.floor(Math.log10(Math.abs(n)) + 15.95) : '?'} significant digits`,
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'pascal-triangle',
    name: "Pascal's Triangle",
    category: 'number',
    description: "Generate Pascal's Triangle — enter number of rows (default 8, max 20)",
    placeholder: '8',
    convert: (input) => {
      const n = Math.max(1, Math.min(20, parseInt(input.trim()) || 8))
      const rows = [[1n]]
      for (let i = 1; i < n; i++) {
        const prev = rows[i - 1]
        const row = [1n]
        for (let j = 1; j < i; j++) row.push(prev[j-1] + prev[j])
        row.push(1n)
        rows.push(row)
      }
      const maxWidth = String(rows[n-1].reduce((a, b) => a > b ? a : b, 0n)).length
      const lines = rows.map((row, i) => {
        const padding = ' '.repeat((n - i - 1) * Math.ceil(maxWidth / 2))
        return padding + row.map(v => String(v).padStart(maxWidth)).join(' ')
      })
      return [
        `Pascal's Triangle (${n} rows):`,
        '',
        ...lines,
        '',
        `Row sums: ${rows.map(r => r.reduce((a, b) => a + b, 0n)).map((v, i) => `Row ${i}: ${v}`).slice(0, 8).join('  ')}`,
        rows.length > 1 ? `(Row sums are powers of 2: 2^n)` : '',
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'binary-arithmetic',
    name: 'Binary Arithmetic',
    category: 'number',
    description: 'Perform arithmetic in binary — format: "1010 + 0110" or "1111 - 0011" or "1010 * 11"',
    placeholder: '1010 + 0110',
    convert: (input) => {
      const m = input.trim().match(/^([01]+)\s*([+\-*\/])\s*([01]+)$/)
      if (!m) return '(format: "binary op binary" — e.g. "1010 + 0110")'
      const a = parseInt(m[1], 2), b = parseInt(m[2+1-1] === '/' ? m[3] : m[3], 2)
      const op = m[2], bVal = parseInt(m[3], 2)
      let result, label
      switch (op) {
        case '+': result = a + bVal; label = 'Sum'; break
        case '-': result = a - bVal; label = 'Difference'; break
        case '*': result = a * bVal; label = 'Product'; break
        case '/':
          if (bVal === 0) return '(division by zero)'
          result = Math.floor(a / bVal); label = 'Quotient'
          break
        default: return '(unsupported operator)'
      }
      const binResult = result < 0 ? '-' + Math.abs(result).toString(2) : result.toString(2)
      return [
        `  ${m[1]}  (${a} decimal)`,
        `${op} ${m[3]}  (${bVal} decimal)`,
        `─${'─'.repeat(Math.max(m[1].length, m[3].length) + 2)}`,
        `  ${binResult}  (${result} decimal)`,
        '',
        `${label}: ${result} = 0b${binResult} = 0x${result < 0 ? '-' : ''}${Math.abs(result).toString(16).toUpperCase()}`,
        op === '/' && bVal !== 0 ? `Remainder: ${a % bVal} (binary: ${(a % bVal).toString(2)})` : '',
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'statistics-calc',
    name: 'Statistics Calculator',
    category: 'number',
    description: 'Calculate mean, median, mode, standard deviation, and more from a list of numbers',
    placeholder: '4, 8, 15, 16, 23, 42',
    convert: (input) => {
      const nums = input.split(/[\s,;]+/).map(Number).filter(n => !isNaN(n) && n.toString() !== '')
      if (nums.length < 2) return '(enter at least 2 numbers, comma or space separated)'
      const n = nums.length
      const sorted = [...nums].sort((a, b) => a - b)
      const sum = nums.reduce((a, b) => a + b, 0)
      const mean = sum / n
      const median = n % 2 === 0 ? (sorted[n/2-1] + sorted[n/2]) / 2 : sorted[(n-1)/2]
      // mode
      const freq = {}
      nums.forEach(v => { freq[v] = (freq[v] || 0) + 1 })
      const maxFreq = Math.max(...Object.values(freq))
      const modes = Object.entries(freq).filter(([, c]) => c === maxFreq).map(([v]) => parseFloat(v))
      const mode = maxFreq === 1 ? 'none (all values unique)' : modes.join(', ')
      // variance + std dev
      const variance = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n
      const sampleVariance = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1)
      const stdDev = Math.sqrt(variance)
      const sampleStdDev = Math.sqrt(sampleVariance)
      const q1 = sorted[Math.floor((n - 1) / 4)]
      const q3 = sorted[Math.ceil((n - 1) * 3 / 4)]
      const iqr = q3 - q1
      const fmt = v => parseFloat(v.toFixed(6)).toString()
      return [
        `Count:    ${n}`,
        `Sum:      ${fmt(sum)}`,
        '',
        `Mean:     ${fmt(mean)}`,
        `Median:   ${fmt(median)}`,
        `Mode:     ${mode}`,
        '',
        `Min:      ${sorted[0]}`,
        `Max:      ${sorted[n-1]}`,
        `Range:    ${fmt(sorted[n-1] - sorted[0])}`,
        '',
        `Q1:       ${fmt(q1)}`,
        `Q3:       ${fmt(q3)}`,
        `IQR:      ${fmt(iqr)}`,
        '',
        `Std Dev (population): ${fmt(stdDev)}`,
        `Std Dev (sample):     ${fmt(sampleStdDev)}`,
        `Variance (pop):       ${fmt(variance)}`,
        '',
        `Sorted: ${sorted.join(', ')}`,
      ].join('\n')
    },
  },
  {
    id: 'roman-numeral-convert',
    name: 'Roman Numeral Converter',
    category: 'number',
    description: 'Convert between Roman numerals and decimal numbers',
    placeholder: 'MMXXVI',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter a Roman numeral like "XIV" or a number like "14")'
      const romanVals = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }
      // If it's a number, convert to Roman
      if (/^\d+$/.test(s)) {
        const n = parseInt(s)
        if (n <= 0 || n > 3999) return '(Roman numerals only support 1–3999)'
        let remaining = n, result = ''
        for (const [r, v] of Object.entries(romanVals)) { while (remaining >= v) { result += r; remaining -= v } }
        return `${n} → ${result}\n\nBreakdown: ${result.split('').reduce((acc, ch, i, arr) => {
          const cur = romanVals[ch], next = romanVals[arr[i+1]] || 0
          if (cur < next) return acc
          if (i > 0 && romanVals[arr[i-1]] < cur) return acc.slice(0, -2) + ` -${romanVals[arr[i-1]]} +${cur} = ${cur - romanVals[arr[i-1]]}` + ', '
          return acc + `${ch}=${cur}, `
        }, '').replace(/, $/, '')}`
      }
      // Roman to decimal
      const upper = s.toUpperCase()
      if (!/^[MDCLXVI]+$/.test(upper)) return '(enter a Roman numeral like "XIV" or a number like "14")'
      let total = 0, prev = 0
      for (let i = upper.length - 1; i >= 0; i--) {
        const val = romanVals[upper[i]]
        if (!val) return `(unknown character "${upper[i]}")`
        total += val < prev ? -val : val
        prev = val
      }
      // Verify by converting back
      let verify = total, verifyStr = ''
      for (const [r, v] of Object.entries(romanVals)) { while (verify >= v) { verifyStr += r; verify -= v } }
      const valid = verifyStr === upper
      return [
        `${upper} → ${total}`,
        valid ? '' : `(Note: standard form would be ${verifyStr})`,
        '',
        `In words: ${['zero','one','two','three','four','five','six','seven','eight','nine'].concat(['ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'])[total] || (total >= 20 ? `${Math.floor(total/10)*10 === total ? '' : ['twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'][Math.floor(total/10)-2] + '-'}${['','one','two','three','four','five','six','seven','eight','nine'][total%10]}` : total)}`,
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'bitwise-ops',
    name: 'Bitwise Operations',
    category: 'number',
    description: 'Perform bitwise operations on integers — enter "a op b" (op: AND, OR, XOR, NOT, <<, >>)',
    placeholder: '255 AND 170',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter: "a op b" — e.g. "255 AND 170" or "42 XOR 15" or "NOT 255")'
      // NOT (unary)
      const notM = s.match(/^NOT\s+(-?\d+)$/i)
      if (notM) {
        const a = parseInt(notM[1])
        const result = ~a
        return [
          `NOT ${a}`,
          `= ${result}`,
          '',
          `Binary: ~${(a >>> 0).toString(2).padStart(32, '0')}`,
          `      = ${(result >>> 0).toString(2).padStart(32, '0')}`,
          `Hex: ~0x${(a >>> 0).toString(16).toUpperCase()} = 0x${(result >>> 0).toString(16).toUpperCase()}`,
        ].join('\n')
      }
      const opMap = {
        'and': (a, b) => a & b, '&': (a, b) => a & b,
        'or': (a, b) => a | b, '|': (a, b) => a | b,
        'xor': (a, b) => a ^ b, '^': (a, b) => a ^ b,
        'nand': (a, b) => ~(a & b),
        '<<': (a, b) => a << b, 'shl': (a, b) => a << b,
        '>>': (a, b) => a >> b, 'shr': (a, b) => a >> b, '>>>': (a, b) => a >>> b,
      }
      const m = s.match(/^(-?\d+)\s+(AND|OR|XOR|NAND|<<|>>|>>>|&|\||\^|SHL|SHR)\s+(-?\d+)$/i)
      if (!m) return '(format: "a AND b" or "a OR b" or "a XOR b" or "a << b" or "NOT a")'
      const a = parseInt(m[1]), op = m[2].toLowerCase(), b = parseInt(m[3])
      const fn = opMap[op]
      if (!fn) return `(unknown operator: ${op})`
      const result = fn(a, b)
      const bits = 32
      const pad = n => (n >>> 0).toString(2).padStart(bits, '0').replace(/(.{8})/g, '$1 ').trim()
      return [
        `  ${m[1].padStart(12)} = ${pad(a)}`,
        `  ${m[3].padStart(12)} = ${pad(b)}`,
        `  ${m[2].toUpperCase().padStart(12)}   ${'─'.repeat(bits + Math.floor(bits/8))}`,
        `  ${result.toString().padStart(12)} = ${pad(result)}`,
        '',
        `Decimal: ${result}`,
        `Hex: 0x${(result >>> 0).toString(16).toUpperCase()}`,
        `Signed: ${result} (as 32-bit signed)`,
      ].join('\n')
    },
  },
  {
    id: 'matrix-2x2',
    name: '2×2 Matrix Calculator',
    category: 'number',
    description: 'Operations on 2×2 matrices — enter "[[a,b],[c,d]] op [[e,f],[g,h]]" (op: * + - det inv)',
    placeholder: '[[1,2],[3,4]] * [[5,6],[7,8]]',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter: "[[a,b],[c,d]] op [[e,f],[g,h]]" — op: * + - or just [[a,b],[c,d]] for det/inv)'
      try {
        // Parse one or two matrices
        const mats = [...s.matchAll(/\[\[([^\]]+)\],\[([^\]]+)\]\]/g)].map(m => {
          const row1 = m[1].split(',').map(Number)
          const row2 = m[2].split(',').map(Number)
          return [[row1[0], row1[1]], [row2[0], row2[1]]]
        })
        if (mats.length === 0) return '(enter matrix like [[1,2],[3,4]])'
        const A = mats[0]
        const det = M => M[0][0]*M[1][1] - M[0][1]*M[1][0]
        const fmt = n => parseFloat(n.toFixed(6)).toString()
        const printMat = M => [`| ${fmt(M[0][0])}  ${fmt(M[0][1])} |`, `| ${fmt(M[1][0])}  ${fmt(M[1][1])} |`]
        // Single matrix: determinant + inverse + trace + eigenvalues
        const detA = det(A)
        const trace = A[0][0] + A[1][1]
        const results = [
          'Matrix A:',
          ...printMat(A),
          '',
          `det(A) = ${fmt(detA)}`,
          `trace(A) = ${fmt(trace)}`,
        ]
        if (Math.abs(detA) > 1e-10) {
          const inv = [[A[1][1]/detA, -A[0][1]/detA], [-A[1][0]/detA, A[0][0]/detA]]
          results.push('', 'Inverse A⁻¹:', ...printMat(inv))
        } else {
          results.push('(singular matrix — no inverse)')
        }
        // Eigenvalues: λ² - trace·λ + det = 0
        const disc = trace * trace - 4 * detA
        if (disc >= 0) {
          const l1 = (trace + Math.sqrt(disc)) / 2, l2 = (trace - Math.sqrt(disc)) / 2
          results.push('', `Eigenvalues: λ₁ = ${fmt(l1)}, λ₂ = ${fmt(l2)}`)
        } else {
          const re = trace/2, im = Math.sqrt(-disc)/2
          results.push('', `Eigenvalues: λ = ${fmt(re)} ± ${fmt(im)}i (complex)`)
        }
        if (mats.length >= 2) {
          const B = mats[1]
          const opM = s.match(/\]\]\s*([+\-*])\s*\[\[/)
          const op = opM ? opM[1] : '*'
          let C
          if (op === '*') {
            C = [[A[0][0]*B[0][0]+A[0][1]*B[1][0], A[0][0]*B[0][1]+A[0][1]*B[1][1]],
                 [A[1][0]*B[0][0]+A[1][1]*B[1][0], A[1][0]*B[0][1]+A[1][1]*B[1][1]]]
          } else if (op === '+') {
            C = [[A[0][0]+B[0][0], A[0][1]+B[0][1]], [A[1][0]+B[1][0], A[1][1]+B[1][1]]]
          } else {
            C = [[A[0][0]-B[0][0], A[0][1]-B[0][1]], [A[1][0]-B[1][0], A[1][1]-B[1][1]]]
          }
          results.push('', `A ${op} B =`, ...printMat(C), `det = ${fmt(det(C))}`)
        }
        return results.join('\n')
      } catch (e) { return `(error: ${e.message})` }
    },
  },
  {
    id: 'unit-fraction',
    name: 'Decimal to Fraction',
    category: 'number',
    description: 'Convert a decimal to the nearest fraction — enter a decimal like "0.333" or "3.14159"',
    placeholder: '0.333333',
    convert: (input) => {
      const n = parseFloat(input.trim())
      if (isNaN(n)) return '(enter a decimal number)'
      const sign = n < 0 ? '-' : ''
      const abs = Math.abs(n)
      const intPart = Math.floor(abs)
      const dec = abs - intPart
      if (dec < 1e-10) return `${n} = ${n}/1 (already an integer)`
      // Stern-Brocot / continued fraction approximation
      const toFrac = (x, maxDen = 10000) => {
        let h1 = 1, h2 = 0, k1 = 0, k2 = 1
        let b = x
        for (let i = 0; i < 50; i++) {
          const a = Math.floor(b)
          const h = a * h1 + h2, k = a * k1 + k2
          if (k > maxDen) break
          h2 = h1; h1 = h; k2 = k1; k1 = k
          const remainder = b - a
          if (Math.abs(remainder) < 1e-10) break
          b = 1 / remainder
        }
        return { num: h1, den: k1 }
      }
      const { num, den } = toFrac(dec)
      const totalNum = intPart * den + num
      const error = Math.abs(n - (totalNum * (n < 0 ? -1 : 1)) / den)
      const exactFrac = intPart > 0 ? `${sign}${intPart} ${num}/${den}` : `${sign}${num}/${den}`
      const improper = `${sign}${totalNum}/${den}`
      // Common fractions
      const commons = [[1,2],[1,3],[2,3],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,6],[5,6],[1,8],[3,8],[5,8],[7,8],[1,10],[3,10]]
      const closest = commons.map(([p,q]) => ({ frac: `${p}/${q}`, err: Math.abs(abs - p/q) })).sort((a,b) => a.err - b.err)[0]
      return [
        `${n} ≈ ${exactFrac}`,
        `Improper fraction: ${improper}`,
        `Decimal check: ${(totalNum/den).toFixed(8)}`,
        `Error: ${error.toExponential(2)}`,
        '',
        `Closest common fraction: ${closest.frac} (error: ${closest.err.toExponential(2)})`,
        '',
        'Simple fractions near this value:',
        ...commons.filter(([p,q]) => Math.abs(abs - p/q) < 0.05).map(([p,q]) => `  ${p}/${q} = ${(p/q).toFixed(6)}`),
      ].join('\n')
    },
  },
  {
    id: 'quadratic-solver',
    name: 'Quadratic Equation Solver',
    category: 'number',
    description: 'Solve ax² + bx + c = 0 — enter "a b c" e.g. "1 -5 6" or "2 3 -2"',
    placeholder: '1 -5 6',
    convert: (input) => {
      const parts = input.trim().split(/[\s,]+/).map(Number)
      if (parts.length < 3 || parts.some(isNaN)) return '(enter: a b c — e.g. "1 -5 6" for x² - 5x + 6 = 0)'
      const [a, b, c] = parts
      if (a === 0) {
        if (b === 0) return c === 0 ? '(0 = 0: infinite solutions)' : '(no solution: 0 ≠ 0)'
        return [`Linear equation: ${b}x + ${c} = 0`, `x = ${-c/b}`].join('\n')
      }
      const disc = b * b - 4 * a * c
      const fmt = n => parseFloat(n.toFixed(10)).toString()
      const eq = `${a}x² ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = 0`
      if (disc > 0) {
        const x1 = (-b + Math.sqrt(disc)) / (2 * a)
        const x2 = (-b - Math.sqrt(disc)) / (2 * a)
        const [xMin, xMax] = [Math.min(x1, x2), Math.max(x1, x2)]
        return [
          eq,
          `Discriminant: ${fmt(disc)} > 0 → 2 real roots`,
          '',
          `x₁ = ${fmt(xMax)}`,
          `x₂ = ${fmt(xMin)}`,
          '',
          `Vertex: x = ${fmt(-b / (2*a))}, y = ${fmt(c - b*b/(4*a))}`,
          `Sum of roots: ${fmt(x1 + x2)} (= -b/a = ${fmt(-b/a)})`,
          `Product of roots: ${fmt(x1 * x2)} (= c/a = ${fmt(c/a)})`,
          `Factored: ${a}(x - ${fmt(xMax)})(x - ${fmt(xMin)}) = 0`,
        ].join('\n')
      } else if (disc === 0) {
        const x = -b / (2 * a)
        return [
          eq,
          `Discriminant: 0 → 1 repeated root`,
          '',
          `x = ${fmt(x)} (double root)`,
          `Factored: ${a}(x - ${fmt(x)})² = 0`,
        ].join('\n')
      } else {
        const re = -b / (2 * a)
        const im = Math.sqrt(-disc) / (2 * a)
        return [
          eq,
          `Discriminant: ${fmt(disc)} < 0 → 2 complex roots`,
          '',
          `x₁ = ${fmt(re)} + ${fmt(im)}i`,
          `x₂ = ${fmt(re)} - ${fmt(im)}i`,
          '',
          `|x| = ${fmt(Math.sqrt(re*re + im*im))} (modulus)`,
        ].join('\n')
      }
    },
  },
  {
    id: 'complex-number',
    name: 'Complex Number Calculator',
    category: 'number',
    description: 'Compute with complex numbers — enter "a+bi op c+di" e.g. "3+4i * 1-2i" (op: + - * /)',
    placeholder: '3+4i * 1-2i',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter: "a+bi op c+di" — e.g. "3+4i * 1-2i" or "2+3i" for single number info)'
      const parseComplex = str => {
        str = str.replace(/\s/g, '').replace(/−/g, '-')
        // Match: a+bi, a-bi, bi, -bi, a, ai, -a, -ai, +bi, -bi
        const m = str.match(/^([+-]?[\d.]+)?([+-][\d.]*i|[+-]?[\d.]*i)?$/)
        if (!m) return null
        const re = m[1] ? parseFloat(m[1]) : 0
        let im = 0
        if (m[2]) {
          const imStr = m[2].replace('i', '')
          im = imStr === '' || imStr === '+' ? 1 : imStr === '-' ? -1 : parseFloat(imStr)
        }
        return { re, im }
      }
      const fmt = n => parseFloat(n.toFixed(8)).toString()
      const formatC = c => `${fmt(c.re)} ${c.im >= 0 ? '+' : '-'} ${fmt(Math.abs(c.im))}i`
      // Try two-operand
      const opM = s.match(/^(.+?)\s*([+\-*/])\s*(.+)$/)
      if (opM) {
        const A = parseComplex(opM[1].trim()), B = parseComplex(opM[3].trim())
        if (A && B) {
          const op = opM[2]
          let C
          if (op === '+') C = { re: A.re + B.re, im: A.im + B.im }
          else if (op === '-') C = { re: A.re - B.re, im: A.im - B.im }
          else if (op === '*') C = { re: A.re*B.re - A.im*B.im, im: A.re*B.im + A.im*B.re }
          else if (op === '/') {
            const denom = B.re*B.re + B.im*B.im
            if (denom === 0) return '(division by zero)'
            C = { re: (A.re*B.re + A.im*B.im)/denom, im: (A.im*B.re - A.re*B.im)/denom }
          }
          return [
            `(${formatC(A)}) ${op} (${formatC(B)})`,
            `= ${formatC(C)}`,
            '',
            `|result| = ${fmt(Math.sqrt(C.re*C.re + C.im*C.im))}`,
            `arg = ${fmt(Math.atan2(C.im, C.re))} rad (${fmt(Math.atan2(C.im, C.re) * 180 / Math.PI)}°)`,
          ].join('\n')
        }
      }
      // Single number
      const z = parseComplex(s)
      if (!z) return '(format: "3+4i" or "3+4i * 1-2i")'
      const mod = Math.sqrt(z.re*z.re + z.im*z.im)
      const arg = Math.atan2(z.im, z.re)
      const sqrtRe = Math.sqrt((mod + z.re) / 2) * (z.im >= 0 ? 1 : -1)
      const sqrtIm = Math.sqrt((mod - z.re) / 2)
      return [
        `z = ${formatC(z)}`,
        '',
        `|z| = ${fmt(mod)} (modulus)`,
        `arg(z) = ${fmt(arg)} rad = ${fmt(arg * 180 / Math.PI)}°`,
        `z* = ${formatC({ re: z.re, im: -z.im })} (conjugate)`,
        `1/z = ${z.re === 0 && z.im === 0 ? 'undefined' : formatC({ re: z.re/(z.re*z.re+z.im*z.im), im: -z.im/(z.re*z.re+z.im*z.im) })}`,
        `√z = ±(${fmt(sqrtRe)} + ${fmt(sqrtIm)}i)`,
        `z² = ${formatC({ re: z.re*z.re - z.im*z.im, im: 2*z.re*z.im })}`,
        `Polar: ${fmt(mod)}e^(${fmt(arg)}i) = ${fmt(mod)}∠${fmt(arg * 180 / Math.PI)}°`,
      ].join('\n')
    },
  },
  {
    id: 'trig-calc',
    name: 'Trigonometry Calculator',
    category: 'number',
    description: 'Calculate trig functions — enter angle like "45°" or "pi/4" or "0.785rad"',
    placeholder: '45°',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      if (!s) return '(enter angle: "45°", "pi/4", "0.785rad", or "45deg")'
      let radians
      // Parse angle
      if (s.includes('pi')) {
        const m = s.match(/([+-]?[\d.]*)\s*[*×]?\s*pi\s*(?:\/\s*([\d.]+))?/)
        if (m) {
          const mul = parseFloat(m[1] || '1') || (m[1] === '-' ? -1 : 1)
          const div = parseFloat(m[2] || '1')
          radians = mul * Math.PI / div
        }
      } else if (s.includes('°') || s.includes('deg')) {
        const m = s.match(/([+-]?[\d.]+)/)
        radians = m ? parseFloat(m[1]) * Math.PI / 180 : null
      } else if (s.includes('rad')) {
        radians = parseFloat(s)
      } else if (s.includes('grad')) {
        const m = s.match(/([+-]?[\d.]+)/)
        radians = m ? parseFloat(m[1]) * Math.PI / 200 : null
      } else {
        // assume degrees if it's a number
        const m = s.match(/([+-]?[\d.]+)/)
        if (m) radians = parseFloat(m[1]) * Math.PI / 180
      }
      if (radians === null || isNaN(radians)) return '(format: "45°", "pi/4", "0.785rad")'
      const degrees = radians * 180 / Math.PI
      const gradians = radians * 200 / Math.PI
      const fmt = n => {
        if (Math.abs(n) < 1e-10) return '0'
        if (Math.abs(Math.abs(n) - 1) < 1e-10) return n > 0 ? '1' : '-1'
        return parseFloat(n.toFixed(8)).toString()
      }
      const tanUndef = Math.abs(Math.cos(radians)) < 1e-10
      return [
        `Angle: ${degrees.toFixed(4)}° = ${radians.toFixed(6)} rad = ${gradians.toFixed(4)} grad`,
        '',
        `sin(θ) = ${fmt(Math.sin(radians))}`,
        `cos(θ) = ${fmt(Math.cos(radians))}`,
        `tan(θ) = ${tanUndef ? 'undefined' : fmt(Math.tan(radians))}`,
        '',
        `csc(θ) = ${Math.abs(Math.sin(radians)) < 1e-10 ? 'undefined' : fmt(1/Math.sin(radians))}`,
        `sec(θ) = ${tanUndef ? 'undefined' : fmt(1/Math.cos(radians))}`,
        `cot(θ) = ${Math.abs(Math.sin(radians)) < 1e-10 ? 'undefined' : fmt(Math.cos(radians)/Math.sin(radians))}`,
        '',
        `sin²(θ) + cos²(θ) = ${fmt(Math.sin(radians)**2 + Math.cos(radians)**2)} (identity check)`,
      ].join('\n')
    },
  },
  {
    id: 'log-calc',
    name: 'Logarithm Calculator',
    category: 'number',
    description: 'Calculate logarithms in any base — enter "number base" e.g. "1000 10" or "8 2" or just "1000"',
    placeholder: '1000 10',
    convert: (input) => {
      const parts = input.trim().split(/[\s,]+/).map(Number)
      if (parts.length === 0 || isNaN(parts[0])) return '(enter: number [base] — e.g. "1000 10" or "8 2")'
      const n = parts[0]
      if (n <= 0) return '(logarithm requires a positive number)'
      const base = parts[1] || 10
      if (base <= 0 || base === 1) return '(base must be positive and not 1)'
      const logN = Math.log(n) / Math.log(base)
      const fmt = x => parseFloat(x.toFixed(8)).toString()
      return [
        `log${base}(${n}) = ${fmt(logN)}`,
        '',
        `Natural log:    ln(${n}) = ${fmt(Math.log(n))}`,
        `Log base 10:    log₁₀(${n}) = ${fmt(Math.log10(n))}`,
        `Log base 2:     log₂(${n}) = ${fmt(Math.log2(n))}`,
        base !== 10 && base !== 2 && base !== Math.E ? `Log base ${base}: log${base}(${n}) = ${fmt(logN)}` : '',
        '',
        `Antilog:        ${base}^${fmt(logN)} = ${fmt(Math.pow(base, logN))}`,
        `e^ln(n):        e^${fmt(Math.log(n))} = ${fmt(Math.exp(Math.log(n)))}`,
        '',
        `ln(n) = ${fmt(Math.log(n))}`,
        `Change of base: log${base}(${n}) = ln(${n}) / ln(${base}) = ${fmt(Math.log(n))} / ${fmt(Math.log(base))} = ${fmt(logN)}`,
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'prime-sieve',
    name: 'Prime Sieve',
    description: 'Find all prime numbers up to N using the Sieve of Eratosthenes. Enter a number up to 100000.',
    category: 'number',
    convert: (input) => {
      const n = parseInt(input.trim())
      if (isNaN(n) || n < 2) return '(enter a number ≥ 2)'
      if (n > 100000) return '(maximum is 100,000 for performance)'
      const sieve = new Uint8Array(n + 1).fill(1)
      sieve[0] = sieve[1] = 0
      for (let i = 2; i * i <= n; i++) {
        if (sieve[i]) {
          for (let j = i * i; j <= n; j += i) sieve[j] = 0
        }
      }
      const primes = []
      for (let i = 2; i <= n; i++) if (sieve[i]) primes.push(i)
      const count = primes.length
      const preview = primes.slice(0, 100)
      const remaining = count > 100 ? `, ... (${count - 100} more)` : ''
      return [
        `Primes up to ${n.toLocaleString()}:`,
        `Count: ${count.toLocaleString()} primes`,
        '',
        preview.join(', ') + remaining,
        '',
        `Largest prime ≤ ${n}: ${primes[primes.length - 1]}`,
        `Prime density: ${(count / n * 100).toFixed(2)}% of integers are prime`,
        `Prime number theorem ≈ n/ln(n) = ${Math.round(n / Math.log(n)).toLocaleString()}`,
      ].join('\n')
    },
  },
  {
    id: 'mod-arith-advanced',
    name: 'Modular Arithmetic (Advanced)',
    description: 'Perform modular arithmetic. Enter: "a mod m" for remainder, "a^b mod m" for modular exponentiation, "inv a mod m" for modular inverse.',
    category: 'number',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      // Modular inverse: inv a mod m
      const invMatch = s.match(/^inv\s+(-?\d+)\s+mod\s+(\d+)$/)
      if (invMatch) {
        const a = BigInt(invMatch[1]), m = BigInt(invMatch[2])
        if (m <= 1n) return '(modulus must be > 1)'
        // Extended Euclidean
        let [old_r, r] = [a < 0n ? ((a % m) + m) % m : a % m, m]
        let [old_s, s2] = [1n, 0n]
        while (r !== 0n) {
          const q = old_r / r;
          [old_r, r] = [r, old_r - q * r];
          [old_s, s2] = [s2, old_s - q * s2]
        }
        if (old_r !== 1n) return `${a} has no inverse mod ${m}\n(gcd(${a}, ${m}) = ${old_r} ≠ 1)`
        const inv = ((old_s % m) + m) % m
        return [
          `Modular Inverse:`,
          `inv(${a}) mod ${m} = ${inv}`,
          '',
          `Verification: ${a} × ${inv} = ${a * inv}`,
          `             ${a * inv} mod ${m} = ${(a * inv % m + m) % m} ✓`,
        ].join('\n')
      }
      // Modular exponentiation: a^b mod m
      const powMatch = s.match(/^(-?\d+)\^(\d+)\s+mod\s+(\d+)$/)
      if (powMatch) {
        let base = BigInt(powMatch[1]), exp = BigInt(powMatch[2]), mod = BigInt(powMatch[3])
        if (mod <= 0n) return '(modulus must be positive)'
        if (mod === 1n) return `${base}^${exp} mod 1 = 0`
        let result = 1n
        base = ((base % mod) + mod) % mod
        while (exp > 0n) {
          if (exp % 2n === 1n) result = result * base % mod
          exp = exp / 2n
          base = base * base % mod
        }
        return [
          `Modular Exponentiation:`,
          `${powMatch[1]}^${powMatch[2]} mod ${powMatch[3]} = ${result}`,
          '',
          `Method: Fast exponentiation (binary method)`,
          `Exponent in binary: ${parseInt(powMatch[2]).toString(2)}`,
        ].join('\n')
      }
      // Basic: a mod m
      const modMatch = s.match(/^(-?\d+)\s+mod\s+(\d+)$/)
      if (modMatch) {
        const a = parseInt(modMatch[1]), m = parseInt(modMatch[2])
        if (m <= 0) return '(modulus must be positive)'
        const rem = ((a % m) + m) % m // always non-negative
        const quot = Math.floor(a / m)
        return [
          `${a} mod ${m} = ${rem}`,
          '',
          `Quotient:    ${quot}`,
          `Remainder:   ${rem}`,
          `Check: ${m} × ${quot} + ${rem} = ${m * quot + rem}`,
          '',
          `Hints: "inv ${a} mod ${m}" for modular inverse`,
          `       "${a}^2 mod ${m}" for modular exponentiation`,
        ].join('\n')
      }
      return '(enter: "a mod m", "a^b mod m", or "inv a mod m")'
    },
  },
  {
    id: 'sequence-gen',
    name: 'Sequence Generator',
    description: 'Generate sequences. Enter: "fib 20" (Fibonacci), "primes 20" (prime numbers), "squares 10" (perfect squares), "1 100 5" (arithmetic: start end step).',
    category: 'number',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      if (s.startsWith('fib')) {
        const n = parseInt(s.match(/\d+/)?.[0] || '10')
        if (n > 100) return '(max 100 Fibonacci numbers)'
        const seq = [0n, 1n]
        for (let i = 2; i < n; i++) seq.push(seq[seq.length - 1] + seq[seq.length - 2])
        return `Fibonacci (${n} terms):\n${seq.slice(0, n).join(', ')}`
      }
      if (s.startsWith('prime')) {
        const n = parseInt(s.match(/\d+/)?.[0] || '20')
        if (n > 200) return '(max 200 primes)'
        const primes = []
        let candidate = 2
        while (primes.length < n) {
          if (primes.every(p => candidate % p !== 0)) primes.push(candidate)
          candidate++
        }
        return `First ${n} prime numbers:\n${primes.join(', ')}`
      }
      if (s.startsWith('square')) {
        const n = parseInt(s.match(/\d+/)?.[0] || '15')
        if (n > 100) return '(max 100 squares)'
        return `Perfect squares (${n} terms):\n${Array.from({ length: n }, (_, i) => (i + 1) ** 2).join(', ')}`
      }
      if (s.startsWith('cube')) {
        const n = parseInt(s.match(/\d+/)?.[0] || '15')
        if (n > 100) return '(max 100 cubes)'
        return `Perfect cubes (${n} terms):\n${Array.from({ length: n }, (_, i) => (i + 1) ** 3).join(', ')}`
      }
      if (s.startsWith('triangle')) {
        const n = parseInt(s.match(/\d+/)?.[0] || '15')
        if (n > 100) return '(max 100 triangular numbers)'
        return `Triangular numbers (${n} terms):\n${Array.from({ length: n }, (_, i) => (i + 1) * (i + 2) / 2).join(', ')}`
      }
      // Arithmetic: start end step
      const parts = input.trim().split(/\s+/).map(Number).filter(n => !isNaN(n))
      if (parts.length >= 2) {
        const [start, end, step = 1] = parts
        if (step === 0) return '(step cannot be zero)'
        const seq = []
        const ascending = step > 0
        for (let v = start; ascending ? v <= end : v >= end; v += step) {
          seq.push(v)
          if (seq.length > 1000) { seq.push('...'); break }
        }
        return `Arithmetic sequence (${start} to ${end}, step ${step}):\n${seq.join(', ')}\n\nCount: ${Math.min(seq.length, 1000)} terms`
      }
      return '(enter: "fib N", "primes N", "squares N", "cubes N", "triangles N", or "start end step")'
    },
  },
  {
    id: 'percentage-solver',
    name: 'Percentage Solver',
    description: 'Solve percentage problems. Enter: "15% of 200", "45 is what % of 300", "300 increased by 15%", "300 decreased by 15%".',
    category: 'number',
    convert: (input) => {
      const s = input.trim().toLowerCase().replace(/\s+/g, ' ')
      // "X% of Y"
      let m = s.match(/^([\d.]+)%\s+of\s+([\d.]+)$/)
      if (m) {
        const pct = parseFloat(m[1]), total = parseFloat(m[2])
        const result = pct / 100 * total
        return `${pct}% of ${total} = ${result}\n\n${pct}% means ${pct} parts per 100\n${result} out of ${total}`
      }
      // "X is what % of Y"
      m = s.match(/^([\d.]+)\s+is\s+(?:what|how many)\s+%\s+of\s+([\d.]+)$/)
      if (m) {
        const part = parseFloat(m[1]), total = parseFloat(m[2])
        const pct = (part / total) * 100
        return `${part} is ${pct.toFixed(4)}% of ${total}\n\nFormula: (${part} / ${total}) × 100 = ${pct.toFixed(4)}%`
      }
      // "X increased/decreased by Y%"
      m = s.match(/^([\d.]+)\s+(increased|decreased|up|down|\+|-)\s+by\s+([\d.]+)%$/)
      if (m) {
        const base = parseFloat(m[1]), pct = parseFloat(m[3])
        const increase = ['increased', 'up', '+'].includes(m[2])
        const change = base * pct / 100
        const result = increase ? base + change : base - change
        const dir = increase ? 'increased' : 'decreased'
        return `${base} ${dir} by ${pct}% = ${result}\n\nChange: ${increase ? '+' : '-'}${change}\nResult: ${result}`
      }
      // "X% increase from Y to Z" (find the percentage)
      m = s.match(/^(?:what is the )?%?\s*(?:change|increase|decrease)\s+from\s+([\d.]+)\s+to\s+([\d.]+)$/)
      if (m) {
        const from = parseFloat(m[1]), to = parseFloat(m[2])
        const pct = ((to - from) / from) * 100
        const dir = pct >= 0 ? 'increase' : 'decrease'
        return `From ${from} to ${to}: ${Math.abs(pct).toFixed(4)}% ${dir}\n\nFormula: ((${to} - ${from}) / ${from}) × 100 = ${pct.toFixed(4)}%`
      }
      return [
        '(enter a percentage problem, e.g.)',
        '  "15% of 200"',
        '  "45 is what % of 300"',
        '  "200 increased by 15%"',
        '  "% change from 80 to 100"',
      ].join('\n')
    },
  },
  {
    id: 'combinatorics',
    name: 'Combinatorics Calculator',
    description: 'Calculate combinations, permutations, and arrangements. Enter: "C(n,r)", "P(n,r)", "n!", or "C 10 3".',
    category: 'number',
    convert: (input) => {
      const s = input.trim().toLowerCase().replace(/\s+/g, ' ')
      const factorial = (n) => {
        if (n < 0 || n > 170) throw new Error('out of range')
        let r = 1n
        for (let i = 2n; i <= BigInt(n); i++) r *= i
        return r
      }
      const C = (n, r) => {
        if (r < 0 || r > n) return 0n
        return factorial(n) / (factorial(r) * factorial(n - r))
      }
      const P = (n, r) => {
        if (r < 0 || r > n) return 0n
        return factorial(n) / factorial(n - r)
      }
      // Factorial: "n!"
      const factMatch = s.match(/^(\d+)!$/)
      if (factMatch) {
        const n = parseInt(factMatch[1])
        if (n > 20) return `${n}! = ${factorial(n).toLocaleString()}\n(very large number — ${n.toString().length} digits in result)`
        return `${n}! = ${factorial(n)}`
      }
      // Parse C(n,r) or P(n,r)
      let type = '', n = 0, r = 0
      const parens = s.match(/^([cp])\(?\s*(\d+)\s*[,\s]\s*(\d+)\)?$/)
      const words = s.match(/^([cp])\s+(\d+)\s+(\d+)$/)
      const match = parens || words
      if (match) {
        type = match[1].toUpperCase(); n = parseInt(match[2]); r = parseInt(match[3])
      } else {
        return '(enter: "C(10,3)", "P(10,3)", "C 10 3", "P 10 3", or "10!")'
      }
      if (n > 170 || r > 170) return '(values too large; max n=170)'
      if (r > n) return `(r cannot exceed n: ${r} > ${n})`
      const result = type === 'C' ? C(n, r) : P(n, r)
      const name = type === 'C' ? 'Combination' : 'Permutation'
      const formula = type === 'C' ? `n! / (r! × (n-r)!)` : `n! / (n-r)!`
      return [
        `${name} ${type}(${n}, ${r}) = ${result.toLocaleString()}`,
        '',
        `Formula: ${formula}`,
        `n = ${n}, r = ${r}`,
        `n! = ${factorial(n).toLocaleString()}`,
        type === 'C'
          ? `r! = ${factorial(r).toLocaleString()}\n(n-r)! = ${factorial(n - r).toLocaleString()}`
          : `(n-r)! = ${factorial(n - r).toLocaleString()}`,
        '',
        type === 'C'
          ? `"How many ways to choose ${r} from ${n}, order doesn't matter"`
          : `"How many ways to arrange ${r} of ${n}, order matters"`,
      ].join('\n')
    },
  },
  {
    id: 'number-properties',
    name: 'Number Properties',
    description: 'Analyze a number: check if prime, perfect, abundant, deficient, find factors, digit sum, and more.',
    category: 'number',
    convert: (input) => {
      const n = parseInt(input.trim())
      if (isNaN(n) || n < 1) return '(enter a positive integer)'
      if (n > 1e12) return '(maximum is 1 trillion)'
      // Find all divisors
      const divisors = []
      for (let i = 1; i * i <= n; i++) {
        if (n % i === 0) {
          divisors.push(i)
          if (i !== n / i) divisors.push(n / i)
        }
      }
      divisors.sort((a, b) => a - b)
      const properDivisors = divisors.filter(d => d !== n)
      const divisorSum = properDivisors.reduce((a, b) => a + b, 0)
      // Prime check
      const isPrime = n > 1 && divisors.length === 2
      // Perfect/abundant/deficient
      const numType = divisorSum === n ? 'Perfect' : divisorSum > n ? 'Abundant' : 'Deficient'
      // Digit properties
      const digits = n.toString().split('').map(Number)
      const digitSum = digits.reduce((a, b) => a + b, 0)
      const digitProd = digits.reduce((a, b) => a * b, 1)
      // Check palindrome
      const isPalin = n.toString() === n.toString().split('').reverse().join('')
      // Prime factorization
      const primeFactors = []
      let temp = n
      for (let p = 2; p * p <= temp; p++) {
        while (temp % p === 0) { primeFactors.push(p); temp /= p }
      }
      if (temp > 1) primeFactors.push(temp)
      const factStr = primeFactors.length > 0
        ? Object.entries(primeFactors.reduce((a, p) => ({ ...a, [p]: (a[p] || 0) + 1 }), {}))
            .map(([p, e]) => e > 1 ? `${p}^${e}` : p).join(' × ')
        : n.toString()
      return [
        `Number: ${n.toLocaleString()}`,
        '',
        `Type:          ${isPrime ? 'Prime' : 'Composite'} | ${numType}`,
        `Palindrome:    ${isPalin ? 'Yes' : 'No'}`,
        `Even/Odd:      ${n % 2 === 0 ? 'Even' : 'Odd'}`,
        '',
        `Divisors (${divisors.length}): ${divisors.slice(0, 20).join(', ')}${divisors.length > 20 ? ' ...' : ''}`,
        `Sum of proper divisors: ${divisorSum.toLocaleString()}`,
        `Prime factorization: ${factStr}`,
        '',
        `Digit sum:     ${digitSum}`,
        `Digit product: ${digitProd}`,
        `Digits:        ${digits.length}`,
        '',
        `Square root:   ${Math.sqrt(n).toFixed(6)}`,
        `Square:        ${(n * n).toLocaleString()}`,
        `Binary:        ${n.toString(2)}`,
        `Hex:           0x${n.toString(16).toUpperCase()}`,
      ].join('\n')
    },
  },
  {
    id: 'base-arithmetic',
    name: 'Base Arithmetic',
    description: 'Perform arithmetic in any base (2–36). Enter: "1010 + 11 base 2" or "FF + 1 hex" or "0b1010 + 0b11".',
    category: 'number',
    convert: (input) => {
      const s = input.trim()
      // Auto-detect prefix notation
      const prefixMatch = s.match(/^(0[bBoOxX][\da-fA-F]+)\s*([+\-*\/])\s*(0[bBoOxX][\da-fA-F]+)$/)
      if (prefixMatch) {
        const parseNum = (str) => {
          if (/^0[bB]/.test(str)) return { val: parseInt(str, 2), base: 2 }
          if (/^0[oO]/.test(str)) return { val: parseInt(str, 8), base: 8 }
          if (/^0[xX]/.test(str)) return { val: parseInt(str, 16), base: 16 }
          return { val: parseInt(str), base: 10 }
        }
        const a = parseNum(prefixMatch[1])
        const b = parseNum(prefixMatch[3])
        const op = prefixMatch[2]
        const result = op === '+' ? a.val + b.val : op === '-' ? a.val - b.val : op === '*' ? a.val * b.val : Math.trunc(a.val / b.val)
        const displayBase = a.base
        const fmtBase = (n, base) => base === 2 ? `0b${n.toString(2)}` : base === 8 ? `0o${n.toString(8)}` : base === 16 ? `0x${n.toString(16).toUpperCase()}` : n.toString()
        return [
          `${fmtBase(a.val, a.base)} ${op} ${fmtBase(b.val, b.base)} = ${fmtBase(result, displayBase)}`,
          '',
          `In decimal: ${a.val} ${op} ${b.val} = ${result}`,
          `In binary: ${result.toString(2)}`,
          `In hex:    0x${result.toString(16).toUpperCase()}`,
          `In octal:  0o${result.toString(8)}`,
        ].join('\n')
      }
      // "a op b base N" format
      const baseMatch = s.match(/^(\w+)\s*([+\-*\/])\s*(\w+)\s+(?:base\s*|in\s*base\s*)?(\d+)$/i)
      const hexMatch = s.match(/^(\w+)\s*([+\-*\/])\s*(\w+)\s+hex(?:adecimal)?$/i)
      const match = baseMatch || hexMatch
      if (match) {
        const base = hexMatch ? 16 : parseInt(match[4])
        if (base < 2 || base > 36) return '(base must be between 2 and 36)'
        const aStr = match[1], op = match[2], bStr = match[3]
        const a = parseInt(aStr, base), b = parseInt(bStr, base)
        if (isNaN(a)) return `(invalid digit in "${aStr}" for base ${base})`
        if (isNaN(b)) return `(invalid digit in "${bStr}" for base ${base})`
        const result = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : Math.trunc(a / b)
        return [
          `Base ${base}: ${aStr.toUpperCase()} ${op} ${bStr.toUpperCase()} = ${result.toString(base).toUpperCase()}`,
          '',
          `Decimal: ${a} ${op} ${b} = ${result}`,
          `Binary:  ${result.toString(2)}`,
          `Hex:     ${result.toString(16).toUpperCase()}`,
        ].join('\n')
      }
      return '(enter: "1010 + 11 base 2", "FF + 1 hex", or "0b1010 + 0b11")'
    },
  },
  {
    id: 'continued-fraction',
    name: 'Continued Fraction',
    description: 'Convert a number to its continued fraction representation. Reveals how irrational or rational a number is. Enter a decimal or fraction.',
    category: 'number',
    convert: (input) => {
      const s = input.trim()
      let x
      if (s.includes('/')) {
        const parts = s.split('/').map(Number)
        x = parts[0] / parts[1]
      } else if (['pi', 'π'].includes(s.toLowerCase())) {
        x = Math.PI
      } else if (s.toLowerCase() === 'e') {
        x = Math.E
      } else if (s.toLowerCase() === 'phi' || s.toLowerCase() === 'φ') {
        x = (1 + Math.sqrt(5)) / 2
      } else if (s.toLowerCase() === 'sqrt2' || s === '√2') {
        x = Math.SQRT2
      } else {
        x = parseFloat(s)
      }
      if (isNaN(x)) return '(enter a decimal, fraction, or "pi", "e", "phi", "sqrt2")'
      // Compute continued fraction coefficients
      const MAX_TERMS = 15
      const EPSILON = 1e-10
      const coeffs = []
      let val = x
      for (let i = 0; i < MAX_TERMS; i++) {
        const a = Math.floor(val)
        coeffs.push(a)
        const frac = val - a
        if (frac < EPSILON) break
        val = 1 / frac
      }
      // Build convergents
      const convergents = []
      let [h_prev, h_curr] = [1, coeffs[0]]
      let [k_prev, k_curr] = [0, 1]
      convergents.push(`${h_curr}/${k_curr} = ${(h_curr / k_curr).toFixed(8)}`)
      for (let i = 1; i < coeffs.length; i++) {
        const h_next = coeffs[i] * h_curr + h_prev
        const k_next = coeffs[i] * k_curr + k_prev;
        [h_prev, h_curr] = [h_curr, h_next];
        [k_prev, k_curr] = [k_curr, k_next]
        convergents.push(`${h_curr}/${k_curr} = ${(h_curr / k_curr).toFixed(8)}`)
      }
      const cfStr = `[${coeffs[0]}; ${coeffs.slice(1).join(', ')}]`
      return [
        `Input: ${x}`,
        `Continued fraction: ${cfStr}`,
        '',
        'Convergents (best rational approximations):',
        ...convergents.map((c, i) => `  ${i + 1}. ${c}`),
        '',
        `Best approximation: ${convergents[convergents.length - 1].split(' ')[0]}`,
        coeffs.length === 1 ? 'This is an integer.' : '',
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'interest-calc',
    name: 'Interest Calculator',
    description: 'Calculate simple and compound interest. Enter: principal rate% years [n] (n = compounding periods per year, default 12).',
    category: 'number',
    convert: (input) => {
      const parts = input.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
      if (parts.length < 3) return '(enter: principal rate% years [compounding periods/year])'
      const [P, rate, years, n = 12] = parts
      const r = rate / 100
      // Simple interest
      const SI = P * r * years
      // Compound interest
      const CI_amount = P * Math.pow(1 + r / n, n * years)
      const CI = CI_amount - P
      // Daily compounding
      const CI_daily = P * Math.pow(1 + r / 365, 365 * years) - P
      // Continuous compounding
      const CI_cont = P * Math.exp(r * years) - P
      // Rule of 72
      const doubleYears = 72 / rate
      const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      return [
        `Principal: $${fmt(P)}`,
        `Rate: ${rate}% per year`,
        `Time: ${years} year${years !== 1 ? 's' : ''}`,
        '',
        `Simple Interest: $${fmt(SI)}  →  Total: $${fmt(P + SI)}`,
        '',
        `Compound Interest (n=${n}/year):`,
        `  Interest: $${fmt(CI)}  →  Total: $${fmt(CI_amount)}`,
        `  Effective annual rate: ${((Math.pow(1 + r / n, n) - 1) * 100).toFixed(4)}%`,
        '',
        `Daily compounding:    $${fmt(CI_daily)}  →  Total: $${fmt(P + CI_daily)}`,
        `Continuous compound:  $${fmt(CI_cont)}  →  Total: $${fmt(P + CI_cont)}`,
        '',
        `Rule of 72: money doubles every ${doubleYears.toFixed(1)} years at ${rate}%`,
      ].join('\n')
    },
  },
  {
    id: 'number-curiosities',
    name: 'Number Curiosities',
    description: 'Discover mathematical curiosities about a number: angel numbers, narcissistic numbers, happy numbers, Fibonacci membership, etc.',
    category: 'number',
    convert: (input) => {
      const n = parseInt(input.trim())
      if (isNaN(n) || n < 0) return '(enter a non-negative integer)'
      if (n > 1e9) return '(maximum is 1 billion)'
      const digits = n.toString().split('').map(Number)
      const numDigits = digits.length
      const facts = []
      // Palindrome
      if (n.toString() === n.toString().split('').reverse().join('')) facts.push('Palindrome number')
      // Narcissistic (Armstrong) number
      const narcSum = digits.reduce((sum, d) => sum + Math.pow(d, numDigits), 0)
      if (narcSum === n) facts.push(`Narcissistic (Armstrong) number: ${digits.join('^' + numDigits + ' + ')} = ${n}`)
      // Perfect square/cube
      if (Number.isInteger(Math.sqrt(n))) facts.push(`Perfect square: √${n} = ${Math.sqrt(n)}`)
      if (Number.isInteger(Math.cbrt(n))) facts.push(`Perfect cube: ∛${n} = ${Math.cbrt(n).toFixed(0)}`)
      // Fibonacci check
      const isPerfectSquare = (x) => { const s = Math.sqrt(x); return s === Math.floor(s) }
      if (isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4)) facts.push('Fibonacci number')
      // Triangular number
      const triTest = Math.sqrt(8 * n + 1)
      if (Number.isInteger(triTest)) facts.push(`Triangular number: T(${(triTest - 1) / 2})`)
      // Happy number
      let happyN = n, happySeen = new Set()
      while (happyN !== 1 && !happySeen.has(happyN)) {
        happySeen.add(happyN)
        happyN = happyN.toString().split('').reduce((s, d) => s + parseInt(d) ** 2, 0)
      }
      if (happyN === 1) facts.push('Happy number')
      else facts.push('Unhappy/Sad number')
      // Kaprekar number
      const sq = (n * n).toString()
      const mid = Math.ceil(sq.length / 2)
      const kLeft = parseInt(sq.slice(0, sq.length - mid) || '0')
      const kRight = parseInt(sq.slice(sq.length - mid))
      if (kLeft + kRight === n && n > 0) facts.push(`Kaprekar number: ${n}² = ${n * n}, ${kLeft} + ${kRight} = ${n}`)
      // Digit sum
      const digitSum = digits.reduce((a, b) => a + b, 0)
      // Sum of digit squares
      const digSqSum = digits.reduce((a, d) => a + d * d, 0)
      return [
        `Number: ${n}`,
        `Digits: ${numDigits}  |  Digit sum: ${digitSum}  |  Digit square sum: ${digSqSum}`,
        '',
        facts.length > 0 ? 'Properties:' : 'No special properties found.',
        ...facts.map(f => `  • ${f}`),
        '',
        `In other bases: bin=${n.toString(2)}  oct=${n.toString(8)}  hex=${n.toString(16).toUpperCase()}`,
      ].filter(Boolean).join('\n')
    },
  },
]
