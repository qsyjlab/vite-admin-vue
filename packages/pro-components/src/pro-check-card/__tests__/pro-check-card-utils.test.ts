import { describe, expect, it } from 'vitest'
import { getInitialProCheckCardIndex, getNextProCheckCardIndex } from '../pro-check-card-utils'

const options = [
  { value: 'a', title: 'A' },
  { value: 'b', title: 'B', disabled: true },
  { value: 'c', title: 'C' },
  { value: 'd', title: 'D', loading: true }
]

describe('pro-check-card-utils', () => {
  it('uses the selected radio card as the initial tab stop', () => {
    expect(getInitialProCheckCardIndex(options, 'c', false)).toBe(2)
    expect(getInitialProCheckCardIndex(options, 'b', false)).toBe(0)
    expect(getInitialProCheckCardIndex(options, ['c'], true)).toBe(0)
  })

  it('wraps arrow navigation and skips disabled or loading cards', () => {
    expect(getNextProCheckCardIndex(options, 0, 'ArrowRight')).toBe(2)
    expect(getNextProCheckCardIndex(options, 2, 'ArrowRight')).toBe(0)
    expect(getNextProCheckCardIndex(options, 0, 'ArrowLeft')).toBe(2)
  })

  it('supports Home and End navigation', () => {
    expect(getNextProCheckCardIndex(options, 2, 'Home')).toBe(0)
    expect(getNextProCheckCardIndex(options, 0, 'End')).toBe(2)
  })
})
