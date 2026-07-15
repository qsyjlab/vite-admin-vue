import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const sourceRoot = new URL('../src/', import.meta.url)

test('theme sources do not depend on application variables or layout selectors', async () => {
  const files = ['tokens.scss', 'dark.scss', 'components/menu.scss', 'components/card.scss']
  const source = (
    await Promise.all(files.map(file => readFile(new URL(file, sourceRoot), 'utf8')))
  ).join('\n')

  assert.doesNotMatch(source, /--global-/)
  assert.doesNotMatch(source, /--layout-/)
  assert.doesNotMatch(source, /basic-layout|is-dark-navigation-menu/)
})

test('theme exposes stable customization tokens', async () => {
  const tokens = await readFile(new URL('tokens.scss', sourceRoot), 'utf8')
  assert.match(tokens, /--framebase-color-bg:/)
  assert.match(tokens, /--framebase-color-text-primary:/)
  assert.match(tokens, /--framebase-border-radius-base:/)
  assert.match(tokens, /--framebase-shadow-light:/)
})
