export const RECOGNIZED_WHATSAPP_FORMATS = [
  '[13/2/2024, 15:04:05] Name: message',
  '13/2/24, 3:04 PM - Name: message',
  '5/16/16, 7:49 PM - Name: message',
  '13/2/24, 3:04 PM Name: message',
]

const FALLBACK_FILE_LABEL = 'Selected file'

const getExtension = fileName => {
  const match = String(fileName || '').match(/\.([^.]+)$/)
  return match ? `.${match[1].toLowerCase()}` : 'none'
}

const getFileType = file => file?.type || 'unknown'

const getFileSize = file => {
  if (typeof file?.size !== 'number') return 'unknown'

  if (file.size < 1024) {
    return `${file.size} B`
  }

  if (file.size < 1024 * 1024) {
    return `${Math.round(file.size / 102.4) / 10} KB`
  }

  return `${Math.round(file.size / 1024 / 102.4) / 10} MB`
}

export const countLines = text => {
  if (!text) return 0

  return text.split(/\r?\n/).length
}

export const createLoadDiagnostic = ({ file, content, kind }) => ({
  kind,
  fileLabel: FALLBACK_FILE_LABEL,
  extension: getExtension(file?.name),
  fileType: getFileType(file),
  size: getFileSize(file),
  lineCount: typeof content === 'string' ? countLines(content) : null,
  recognizedFormats: RECOGNIZED_WHATSAPP_FORMATS,
})

export const createFormatDiagnostic = ({ file, content }) => ({
  ...createLoadDiagnostic({ file, content, kind: 'format' }),
  parser: null,
  stableCause: 'No supported WhatsApp message lines were found.',
})

export const createReadDiagnostic = ({ file }) => ({
  ...createLoadDiagnostic({ file, kind: 'read' }),
  stableCause: 'The browser could not read the selected file.',
})
