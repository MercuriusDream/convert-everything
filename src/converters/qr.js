export const qrConverters = [
  {
    id: 'text-to-qr',
    name: 'Text to QR Code',
    category: 'encode',
    description: 'Generate a QR code from any text or URL',
    convert: async (input) => {
      if (!input.trim()) return ''
      const QRCode = (await import('qrcode')).default
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
      const dataUrl = await QRCode.toDataURL(input, {
        width: 300,
        margin: 2,
        color: {
          dark: isDark ? '#e8e5de' : '#2c2a25',
          light: isDark ? '#1a1916' : '#faf8f5',
        },
      })
      return dataUrl
    },
    showsPreview: true,
  },
  {
    id: 'qr-to-text',
    name: 'QR Code Reader',
    category: 'encode',
    description: 'Read text from a QR code image — drop or upload a QR code',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files

      if (typeof globalThis.BarcodeDetector !== 'function') {
        return { text: '(QR reading requires a browser with BarcodeDetector API — try Chrome)' }
      }

      if (typeof globalThis.createImageBitmap !== 'function') {
        return { text: '(QR reading requires createImageBitmap support in this browser)' }
      }

      try {
        const bitmap = await globalThis.createImageBitmap(file)
        const detector = new globalThis.BarcodeDetector({ formats: ['qr_code'] })
        const results = await detector.detect(bitmap)
        if (results.length > 0 && results[0].rawValue) {
          return { text: results[0].rawValue }
        }
        return { text: '(no QR code found in image)' }
      } catch (error) {
        return { text: `(QR decode failed: ${error?.message || 'unknown error'})` }
      }
    },
  },
]
