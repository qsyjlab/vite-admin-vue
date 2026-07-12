import { describe, expect, it } from 'vitest'
import { normalizeProUploadPercentage, proUploadStatusMap } from '../pro-upload-list-utils'

describe('pro upload list utils', () => {
  it('normalizes progress into a stable percentage', () => {
    expect(normalizeProUploadPercentage(-10)).toBe(0)
    expect(normalizeProUploadPercentage(51.6)).toBe(52)
    expect(normalizeProUploadPercentage(120)).toBe(100)
    expect(normalizeProUploadPercentage(Number.NaN)).toBe(0)
  })

  it('provides metadata for every upload status', () => {
    expect(Object.keys(proUploadStatusMap)).toEqual(['ready', 'uploading', 'success', 'fail'])
  })
})
