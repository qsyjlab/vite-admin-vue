import { describe, expect, it } from 'vitest'
import { normalizeProCardSpacing, resolveProCardColumns } from '../pro-card-utils'

describe('pro-card utils', () => {
  it('resolves responsive columns from the nearest active breakpoint', () => {
    const columns = { xs: 1, md: 2, xl: 4 }
    expect(resolveProCardColumns(columns, 500)).toBe(1)
    expect(resolveProCardColumns(columns, 900)).toBe(2)
    expect(resolveProCardColumns(columns, 1100)).toBe(2)
    expect(resolveProCardColumns(columns, 1400)).toBe(4)
  })

  it('normalizes card spacing values', () => {
    expect(normalizeProCardSpacing(false)).toBe('0px')
    expect(normalizeProCardSpacing(12)).toBe('12px')
    expect(normalizeProCardSpacing('1rem')).toBe('1rem')
  })
})
