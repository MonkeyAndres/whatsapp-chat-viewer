const { test, expect } = require('@playwright/test')
const { CONTACTS, buildSyntheticLargeChat } = require('./fixtures/syntheticLargeChat')

const uploadSyntheticChat = async page => {
  await page.goto('/')
  await page.setInputFiles('#chat', {
    name: 'synthetic-large-whatsapp-chat.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from(buildSyntheticLargeChat(), 'utf8'),
  })
}

const expectNoHorizontalOverflow = async page => {
  const overflowing = await page.evaluate(() => {
    const documentElement = document.documentElement
    const chatScroller = document.querySelector('.chatVirtuoso')

    return [
      documentElement.scrollWidth > documentElement.clientWidth + 1
        ? 'document'
        : null,
      chatScroller && chatScroller.scrollWidth > chatScroller.clientWidth + 1
        ? 'chat'
        : null,
    ].filter(Boolean)
  })

  expect(overflowing).toEqual([])
}

const expectReadableTimestampContrast = async (page, expectedKinds) => {
  await page.waitForFunction(kinds => (
    kinds.every(kind => document.querySelector(`.message.${kind} .date`))
  ), expectedKinds)

  const results = await page.evaluate(kinds => {
    const parseCssColor = cssColor => {
      const match = cssColor.match(/rgba?\(([^)]+)\)/)
      if (!match) throw new Error(`Unsupported color: ${cssColor}`)

      const [r, g, b, a = '1'] = match[1]
        .split(',')
        .map(part => part.trim())

      return {
        r: Number(r),
        g: Number(g),
        b: Number(b),
        a: Number(a),
      }
    }

    const blend = (top, bottom) => {
      const alpha = top.a + bottom.a * (1 - top.a)

      if (alpha === 0) {
        return { r: 255, g: 255, b: 255, a: 1 }
      }

      return {
        r: ((top.r * top.a) + (bottom.r * bottom.a * (1 - top.a))) / alpha,
        g: ((top.g * top.a) + (bottom.g * bottom.a * (1 - top.a))) / alpha,
        b: ((top.b * top.a) + (bottom.b * bottom.a * (1 - top.a))) / alpha,
        a: alpha,
      }
    }

    const getEffectiveBackground = element => {
      let background = { r: 255, g: 255, b: 255, a: 1 }
      const layers = []
      let currentElement = element

      while (currentElement) {
        layers.push(parseCssColor(getComputedStyle(currentElement).backgroundColor))
        currentElement = currentElement.parentElement
      }

      layers.reverse().forEach(layer => {
        background = blend(layer, background)
      })

      return background
    }

    const channelToLinear = value => {
      const scaled = value / 255
      return scaled <= 0.03928
        ? scaled / 12.92
        : Math.pow((scaled + 0.055) / 1.055, 2.4)
    }

    const luminance = color => (
      (0.2126 * channelToLinear(color.r)) +
      (0.7152 * channelToLinear(color.g)) +
      (0.0722 * channelToLinear(color.b))
    )

    const contrastRatio = (foreground, background) => {
      const foregroundLuminance = luminance(foreground)
      const backgroundLuminance = luminance(background)

      return (
        (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
      )
    }

    return kinds.map(kind => {
      const message = document.querySelector(`.message.${kind}`)
      if (!message) {
        return { kind, found: false, ratio: 0 }
      }

      const date = message.querySelector('.date')
      const foreground = parseCssColor(getComputedStyle(date).color)
      const background = getEffectiveBackground(message)

      return {
        kind,
        found: true,
        foreground: getComputedStyle(date).color,
        background: getComputedStyle(message).backgroundColor,
        ratio: Number(contrastRatio(foreground, background).toFixed(2)),
      }
    })
  }, expectedKinds)

  expect(results).toEqual(expect.arrayContaining(
    expectedKinds.map(kind => expect.objectContaining({
      kind,
      found: true,
    }))
  ))

  results.forEach(result => {
    expect(result.ratio, `${result.kind} timestamp contrast`).toBeGreaterThanOrEqual(4.5)
  })
}

test.describe('large synthetic chat reading flow', () => {
  test('supports read modes, language changes, scrolling, contact changes, resize, keyboard focus, and reduced motion', async ({ page, browserName }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await uploadSyntheticChat(page)

    await expect(page.getByRole('heading', { name: 'Select who you are.' })).toBeVisible()
    await page.getByRole('button', { name: CONTACTS[0] }).click()

    await expect(page.locator('.chatView-header').getByRole('heading', { name: 'WhatsApp Chat' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Latest messages' })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByText(/Synthetic message 10019/)).toBeVisible()

    await page.getByRole('button', { name: 'From the beginning' }).click()
    await expect(page.getByRole('button', { name: 'From the beginning' })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByText(/Messages and calls are end-to-end encrypted/)).toBeVisible()
    await expectReadableTimestampContrast(page, ['mine', 'others', 'system'])

    const list = page.locator('.chatVirtuoso')
    await list.evaluate(element => {
      element.scrollTop = element.scrollHeight / 2
      element.dispatchEvent(new Event('scroll', { bubbles: true }))
    })
    await expect(page.getByTestId('message-row').first()).toBeVisible()

    await page.getByRole('button', { name: 'Back' }).click()
    await expect(page.getByRole('heading', { name: 'Select who you are.' })).toBeVisible()
    await page.getByRole('button', { name: CONTACTS[2] }).click()
    await expect(page.getByRole('button', { name: 'Latest messages' })).toHaveAttribute('aria-pressed', 'true')
    await expectReadableTimestampContrast(page, ['mine', 'others'])

    const languageSwitcher = page.getByRole('group', { name: 'Language' })

    await languageSwitcher.getByRole('button', { name: 'ES', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Mensajes recientes' })).toBeVisible()
    await page.getByRole('group', { name: 'Idioma' }).getByRole('button', { name: 'EN', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Latest messages' })).toBeVisible()

    await page.keyboard.press('Tab')
    const focusedControl = page.locator(':focus')
    await expect(focusedControl).toBeVisible()

    const focusOutline = await focusedControl.evaluate(element => getComputedStyle(element).outlineStyle)
    expect(focusOutline).not.toBe('none')

    await page.setViewportSize({ width: 393, height: 851 })
    await expect(page.locator('.chatView-header').getByRole('heading', { name: 'WhatsApp Chat' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Latest messages' })).toBeVisible()
    await expectNoHorizontalOverflow(page)

    await page.setViewportSize({ width: 1280, height: 720 })
    await expect(page.getByRole('button', { name: 'Latest messages' })).toBeVisible()
    await expectNoHorizontalOverflow(page)

    expect(browserName).toBe('chromium')
  })
})
