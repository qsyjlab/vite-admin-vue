import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import {
  getProFieldRenderer,
  hasProFieldRenderer,
  registerProField,
  unregisterProField
} from '../pro-field-registry'

describe('pro field registry', () => {
  it('registers, restores and removes renderers', () => {
    const first = { read: defineComponent(() => () => 'first') }
    const second = { read: defineComponent(() => () => 'second') }
    const restoreFirst = registerProField('test-score', first)
    const restoreSecond = registerProField('test-score', second)

    expect(getProFieldRenderer('test-score')).toBe(second)
    restoreSecond()
    expect(getProFieldRenderer('test-score')).toBe(first)
    restoreFirst()
    expect(hasProFieldRenderer('test-score')).toBe(false)

    registerProField('test-score', first)
    expect(unregisterProField('test-score')).toBe(true)
  })
})
