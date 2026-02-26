// Image converters need special handling — they work with files, not plain text.
// The convert function receives the input text, but for image-to-base64 we use
// a special `fileConvert` function that the ConverterView knows about.

export const imageConverters = [
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    category: 'encode',
    description: 'Convert an image file to a Base64 data URL — drag & drop or click to upload',
    acceptsFile: true,
    fileConvert: (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
    },
    convert: (input) => {
      if (!input.trim()) return ''
      // If someone pastes a data URL, just echo it back
      if (input.trim().startsWith('data:')) return input.trim()
      return '(drop or upload an image file, or paste a data URL)'
    },
  },
  {
    id: 'base64-to-image',
    name: 'Base64 to Image',
    category: 'encode',
    description: 'Preview an image from a Base64 data URL string',
    showsPreview: true,
    convert: (input) => {
      const trimmed = input.trim()
      if (!trimmed) return ''
      // auto-prepend data uri if raw base64
      if (!trimmed.startsWith('data:') && /^[A-Za-z0-9+/=\s]+$/.test(trimmed)) {
        return `data:image/png;base64,${trimmed.replace(/\s/g, '')}`
      }
      if (trimmed.startsWith('data:image')) return trimmed
      return '(paste a base64 data URL starting with data:image/...)'
    },
  },
  {
    id: 'file-to-base64',
    name: 'Any File to Base64',
    category: 'encode',
    description: 'Convert any file to a Base64 data URL string',
    acceptsFile: true,
    acceptTypes: '*',
    fileConvert: (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
    },
    convert: (input) => {
      if (!input.trim()) return ''
      if (input.trim().startsWith('data:')) return input.trim()
      return '(drop or upload any file)'
    },
  },
]
