import { unregister } from './serviceWorker'

describe('service worker cleanup', () => {
  const originalServiceWorker = navigator.serviceWorker
  const originalCaches = window.caches
  const originalReload = window.location.reload

  beforeEach(() => {
    sessionStorage.clear()

    delete window.location.reload
    window.location.reload = jest.fn()

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        controller: {},
        getRegistrations: jest.fn(),
      },
    })

    Object.defineProperty(window, 'caches', {
      configurable: true,
      value: {
        keys: jest.fn(),
        delete: jest.fn(),
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: originalServiceWorker,
    })
    Object.defineProperty(window, 'caches', {
      configurable: true,
      value: originalCaches,
    })
    window.location.reload = originalReload
  })

  test('unregisters viewer registrations, clears only viewer caches, and reloads once', async () => {
    const unregisterViewer = jest.fn(() => Promise.resolve(true))
    const unregisterOtherApp = jest.fn(() => Promise.resolve(true))

    navigator.serviceWorker.getRegistrations.mockResolvedValue([
      {
        scope: 'https://monkeyandres.github.io/whatsapp-chat-viewer/',
        unregister: unregisterViewer,
      },
      {
        scope: 'https://monkeyandres.github.io/another-app/',
        unregister: unregisterOtherApp,
      },
    ])
    window.caches.keys.mockResolvedValue([
      'whatsapp-chat-viewer-precache',
      'precache-v2-https://monkeyandres.github.io/whatsapp-chat-viewer/',
      'precache-v2-https://monkeyandres.com/whatsapp-chat-viewer/',
      'runtime-https://monkeyandres.com/whatsapp-chat-viewer/',
      'precache-v2',
      'runtime',
      'whatsapp-chat-viewer-precache-v2',
      'precache-v2-https://monkeyandres.github.io/another-app/',
      'runtime-https://monkeyandres.github.io/another-app/',
      'synthetic-cache-from-another-app',
    ])
    window.caches.delete.mockResolvedValue(true)

    await unregister({ reloadOnUnregister: true })

    expect(unregisterViewer).toHaveBeenCalledTimes(1)
    expect(unregisterOtherApp).not.toHaveBeenCalled()
    expect(window.caches.delete).toHaveBeenCalledWith(
      'whatsapp-chat-viewer-precache'
    )
    expect(window.caches.delete).toHaveBeenCalledWith(
      'precache-v2-https://monkeyandres.github.io/whatsapp-chat-viewer/'
    )
    expect(window.caches.delete).toHaveBeenCalledWith(
      'precache-v2-https://monkeyandres.com/whatsapp-chat-viewer/'
    )
    expect(window.caches.delete).toHaveBeenCalledWith(
      'runtime-https://monkeyandres.com/whatsapp-chat-viewer/'
    )
    expect(window.caches.delete).not.toHaveBeenCalledWith('precache-v2')
    expect(window.caches.delete).not.toHaveBeenCalledWith('runtime')
    expect(window.caches.delete).not.toHaveBeenCalledWith(
      'whatsapp-chat-viewer-precache-v2'
    )
    expect(window.caches.delete).not.toHaveBeenCalledWith(
      'precache-v2-https://monkeyandres.github.io/another-app/'
    )
    expect(window.caches.delete).not.toHaveBeenCalledWith(
      'runtime-https://monkeyandres.github.io/another-app/'
    )
    expect(window.caches.delete).not.toHaveBeenCalledWith(
      'synthetic-cache-from-another-app'
    )
    expect(window.location.reload).toHaveBeenCalledTimes(1)

    await unregister({ reloadOnUnregister: true })

    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })

  test('does not fail when Cache Storage is unavailable', async () => {
    const unregisterRegistration = jest.fn(() => Promise.resolve(true))

    Object.defineProperty(window, 'caches', {
      configurable: true,
      value: undefined,
    })
    navigator.serviceWorker.getRegistrations.mockResolvedValue([
      {
        scope: 'https://monkeyandres.github.io/whatsapp-chat-viewer/',
        unregister: unregisterRegistration,
      },
    ])

    await unregister({ reloadOnUnregister: true })

    expect(unregisterRegistration).toHaveBeenCalledTimes(1)
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})
