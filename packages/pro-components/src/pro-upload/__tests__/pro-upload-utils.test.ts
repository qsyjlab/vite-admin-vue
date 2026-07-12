import { describe, expect, it } from 'vitest'
import {
  cloneProUploadFiles,
  matchesProUploadAccept,
  validateProUploadFile
} from '../pro-upload-utils'

const image = { name: 'cover.PNG', size: 1024, type: 'image/png' }

describe('pro upload utils', () => {
  it('matches extensions, mime types and wildcards', () => {
    expect(matchesProUploadAccept(image, '.png,.jpg')).toBe(true)
    expect(matchesProUploadAccept(image, 'image/*')).toBe(true)
    expect(matchesProUploadAccept(image, 'application/pdf')).toBe(false)
  })

  it('validates file size and accept rules', () => {
    expect(validateProUploadFile(image, { maxSize: 512 })).toBe('size')
    expect(validateProUploadFile(image, { accept: '.pdf' })).toBe('accept')
    expect(validateProUploadFile(image, { accept: 'image/*', maxSize: 2048 })).toBeUndefined()
  })

  it('clones the controlled file array', () => {
    const files = [{ name: 'a.txt' }]
    const cloned = cloneProUploadFiles(files)
    expect(cloned).not.toBe(files)
    expect(cloned[0]).not.toBe(files[0])
  })
})
