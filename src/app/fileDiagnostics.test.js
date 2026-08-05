import {
  createFormatDiagnostic,
  createReadDiagnostic,
} from './fileDiagnostics'

const privateChatText = [
  'not a supported export',
  'Alice Example: secret birthday plan',
  '+15551234567',
].join('\n')

describe('file diagnostics', () => {
  test('creates a format diagnostic without exposing file names or chat content', () => {
    const diagnostic = createFormatDiagnostic({
      file: {
        name: 'Alice and Bob private chat.txt',
        type: 'text/plain',
        size: 1420,
      },
      content: privateChatText,
    })

    const serializedDiagnostic = JSON.stringify(diagnostic)

    expect(diagnostic.kind).toBe('format')
    expect(diagnostic.extension).toBe('.txt')
    expect(diagnostic.fileType).toBe('text/plain')
    expect(diagnostic.size).toBe('1.4 KB')
    expect(diagnostic.lineCount).toBe(3)
    expect(diagnostic.parser).toBe(null)
    expect(diagnostic.stableCause).toBe(
      'No supported WhatsApp message lines were found.'
    )
    expect(serializedDiagnostic).not.toContain('Alice')
    expect(serializedDiagnostic).not.toContain('Bob')
    expect(serializedDiagnostic).not.toContain('secret birthday plan')
    expect(serializedDiagnostic).not.toContain('+15551234567')
  })

  test('creates a read diagnostic before content exists', () => {
    const diagnostic = createReadDiagnostic({
      file: {
        name: 'family-chat.zip',
        type: 'application/zip',
        size: 98,
      },
    })

    expect(diagnostic).toMatchObject({
      kind: 'read',
      fileLabel: 'Selected file',
      extension: '.zip',
      fileType: 'application/zip',
      size: '98 B',
      lineCount: null,
      stableCause: 'The browser could not read the selected file.',
    })
  })
})
