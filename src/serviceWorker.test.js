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

  test('unregisters old registrations, clears previous caches, and reloads once', async () => {
    const unregisterFirst = jest.fn(() => Promise.resolve(true))
    const unregisterSecond = jest.fn(() => Promise.resolve(true))

    navigator.serviceWorker.getRegistrations.mockResolvedValue([
      { unregister: unregisterFirst },
      { unregister: unregisterSecond },
    ])
    window.caches.keys.mockResolvedValue([
      'precache-v2-https://monkeyandres.com/whatsapp-chat-viewer/',
      'runtime-https://monkeyandres.com/whatsapp-chat-viewer/',
      'other-cache',
    ])
    window.caches.delete.mockResolvedValue(true)

    await unregister({ reloadOnUnregister: true })

    expect(unregisterFirst).toHaveBeenCalledTimes(1)
    expect(unregisterSecond).toHaveBeenCalledTimes(1)
    expect(window.caches.delete).toHaveBeenCalledWith(
      'precache-v2-https://monkeyandres.com/whatsapp-chat-viewer/'
    )
    expect(window.caches.delete).toHaveBeenCalledWith(
      'runtime-https://monkeyandres.com/whatsapp-chat-viewer/'
    )
    expect(window.caches.delete).toHaveBeenCalledWith('other-cache')
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
      { unregister: unregisterRegistration },
    ])

    await unregister({ reloadOnUnregister: true })

    expect(unregisterRegistration).toHaveBeenCalledTimes(1)
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})
