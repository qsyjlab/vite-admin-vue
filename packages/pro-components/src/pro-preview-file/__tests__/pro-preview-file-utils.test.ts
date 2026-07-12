import { describe, expect, it } from 'vitest'
import { getProPreviewFileKind, getProPreviewFileValue } from '../pro-preview-file-utils'

describe('pro preview file utils', () => {
  it('detects supported extensions without case sensitivity', () => {
    expect(getProPreviewFileKind({ name: 'photo.WEBP' })).toBe('image')
    expect(getProPreviewFileKind({ name: 'report.PDF?download=1' })).toBe('pdf')
    expect(getProPreviewFileKind({ name: 'data.xlsx' })).toBe('xlsx')
    expect(getProPreviewFileKind({ name: 'contract.docx' })).toBe('docx')
  })

  it('prefers mime type and returns unsupported for unknown files', () => {
    expect(getProPreviewFileKind({ name: 'asset.bin', type: 'image/png' })).toBe('image')
    expect(getProPreviewFileKind({ name: 'archive.zip' })).toBe('unsupported')
  })

  it('resolves the remote URL', () => {
    expect(getProPreviewFileValue({ name: 'report.pdf', url: '/report.pdf' })).toBe('/report.pdf')
  })
})
