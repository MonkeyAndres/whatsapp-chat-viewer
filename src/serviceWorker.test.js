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

  test('unregisters old registrations, clears app caches, and reloads once', async () => {
    const unregisterFirst = jest.fn(() => Promise.resolve(true))
    const unregisterSecond = jest.fn(() => Promise.resolve(true))

    navigator.serviceWorker.getRegistrations.mockResolvedValue([
      { unregister: unregisterFirst },
      { unregister: unregisterSecond },
    ])
    window.caches.keys.mockResolvedValue([
      'whatsapp-chat-viewer-precache',
      'other-cache',
    ])
    window.caches.delete.mockResolvedValue(true)

    await unregister({ reloadOnUnregister: true })

    expect(unregisterFirst).toHaveBeenCalledTimes(1)
    expect(unregisterSecond).toHaveBeenCalledTimes(1)
    expect(window.caches.delete).toHaveBeenCalledWith(
      'whatsapp-chat-viewer-precache'
    )
    expect(window.caches.delete).not.toHaveBeenCalledWith('other-cache')
    expect(window.location.reload).toHaveBeenCalledTimes(1)

    await unregister({ reloadOnUnregister: true })

    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})
