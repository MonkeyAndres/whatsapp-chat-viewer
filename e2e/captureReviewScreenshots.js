const fs = require('fs')
const path = require('path')
const { chromium } = require('@playwright/test')
const { CONTACTS, buildSyntheticLargeChat } = require('./fixtures/syntheticLargeChat')

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4175'
const outputDir = process.env.EVIDENCE_OUTPUT_DIR || '.worker-evidence/artifacts'

const uploadSyntheticChat = async page => {
  await page.goto(baseURL)
  await page.setInputFiles('#chat', {
    name: 'synthetic-large-whatsapp-chat.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from(buildSyntheticLargeChat(), 'utf8'),
  })
  await page.getByRole('button', { name: CONTACTS[0] }).click()
  await page.getByRole('button', { name: 'From the beginning' }).click()
}

const capture = async ({ browser, name, viewport }) => {
  const page = await browser.newPage({
    viewport,
    reducedMotion: 'reduce',
  })

  await uploadSyntheticChat(page)
  await page.locator('.chatVirtuoso').evaluate(element => {
    element.scrollTop = element.scrollHeight * 0.52
    element.dispatchEvent(new Event('scroll', { bubbles: true }))
  })
  await page.waitForTimeout(500)

  const fileName = `${name}.png`
  await page.screenshot({
    path: path.join(outputDir, fileName),
    fullPage: true,
  })
  await page.close()

  return {
    fileName,
    viewport,
  }
}

const run = async () => {
  fs.mkdirSync(outputDir, { recursive: true })

  const browser = await chromium.launch()
  const captures = []

  try {
    captures.push(await capture({
      browser,
      name: 'desktop-large-chat-reading',
      viewport: { width: 1280, height: 720 },
    }))
    captures.push(await capture({
      browser,
      name: 'mobile-large-chat-reading',
      viewport: { width: 393, height: 851 },
    }))
  } finally {
    await browser.close()
  }

  fs.writeFileSync(
    path.join(outputDir, 'sanitized-review-report.json'),
    `${JSON.stringify({
      fixture: {
        source: 'e2e/fixtures/syntheticLargeChat.js',
        messageCount: 10020,
        contacts: CONTACTS.length,
        includesSystemNotices: true,
        includesMultilineMessages: true,
        classification: 'synthetic',
      },
      screenshots: captures,
      baseURL,
    }, null, 2)}\n`
  )
}

run().catch(error => {
  console.error(error)
  process.exit(1)
})
