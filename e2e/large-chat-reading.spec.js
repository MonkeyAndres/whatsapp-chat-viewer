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
