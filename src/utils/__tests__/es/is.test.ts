import { isEmptyValue } from '../../es/is'
import { describe, it, expect } from 'vitest'

describe('is', () => {
  it('isEmptyValue should work', () => {
    expect(isEmptyValue(0)).toEqual(false)
    expect(isEmptyValue(undefined)).toEqual(true)
    expect(isEmptyValue(null)).toEqual(true)
    expect(isEmptyValue('')).toEqual(true)
    expect(isEmptyValue({})).toEqual(false)
  })
})
