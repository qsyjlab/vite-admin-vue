import { describe, expect, it } from 'vitest'
import { getProOptionField, getProOptionKey } from '../pro-option'

describe('pro option', () => {
  const option = {
    content: {
      label: '平台技术部',
      code: 'platform'
    },
    disabled: true
  }

  it('reads mapped option fields from array paths', () => {
    expect(getProOptionField(option, ['content', 'label'])).toBe('平台技术部')
    expect(getProOptionField(option, ['content', 'code'])).toBe('platform')
    expect(getProOptionField(option, 'disabled')).toBe(true)
  })

  it('uses primitive values as stable keys and falls back for unsupported values', () => {
    expect(getProOptionKey(option, ['content', 'code'], 3)).toBe('platform')
    expect(getProOptionKey(option, 'disabled', 3)).toBe(3)
  })
})
