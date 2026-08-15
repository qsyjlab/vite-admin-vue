import { describe, expect, it } from 'vitest'
import { formatJsonText, minifyJsonText, parseJsonValue } from '../pro-json-editor-utils'

describe('pro-json-editor-utils', () => {
  it('formats and optionally sorts object keys', () => {
    expect(formatJsonText('{"b":2,"a":1}', 2, true).text).toBe('{\n  "a": 1,\n  "b": 2\n}')
  })

  it('minifies valid JSON', () => {
    expect(minifyJsonText('{\n  "name": "demo"\n}').text).toBe('{"name":"demo"}')
  })

  it('returns structured parse errors', () => {
    const result = parseJsonValue('{\n  "name":\n}')
    expect(result.value).toBeUndefined()
    expect(result.error?.message).toBeTruthy()
  })
})
