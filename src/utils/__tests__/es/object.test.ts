import { hasOnlyPropsWithValue } from '../../es/object'
import { describe, it, expect } from 'vitest'

describe('is', () => {
  it('hasOnlyPropsWithValue should work', () => {
    expect(hasOnlyPropsWithValue({ a: 1 }, ['a'])).toEqual(true)
    expect(hasOnlyPropsWithValue({ a: 1 }, 'a')).toEqual(true)

    expect(hasOnlyPropsWithValue({ a: 1, b: false }, 'a')).toEqual(false)
    expect(hasOnlyPropsWithValue({ a: 1, b: 2 }, 'a')).toEqual(false)

    expect(hasOnlyPropsWithValue({ a: 1, b: undefined }, 'a')).toEqual(true)
    expect(hasOnlyPropsWithValue({ a: 1, b: '' }, 'a')).toEqual(true)
    expect(hasOnlyPropsWithValue({ a: 1, b: null }, 'a')).toEqual(true)

    expect(hasOnlyPropsWithValue({ a: 1, b: null }, ['a', 'b'])).toEqual(false)

    expect(hasOnlyPropsWithValue({ a: 1, b: 2, c: 1 }, ['a', 'b'])).toEqual(false)
    expect(hasOnlyPropsWithValue({ a: 1, b: 2, c: null }, ['a', 'b'])).toEqual(true)
  })
})
