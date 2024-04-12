import { ensureArray, unique } from '../../es/array'
import { describe, it, expect } from 'vitest'

describe('array', () => {
  it('ensureArray should work', () => {
    expect(ensureArray(0)).toEqual([0])
    expect(ensureArray([0])).toEqual([0])
    expect(ensureArray([])).toEqual([])
    expect(ensureArray(undefined)).toEqual([])
    expect(ensureArray(null)).toEqual([])
    expect(ensureArray('')).toEqual([])
  })

  it('unique should work', () => {
    expect(unique([1, 2, 3, 1])).toEqual([1, 2, 3])
    expect(unique([1, 2, 3])).toEqual([1, 2, 3])
  })
})
