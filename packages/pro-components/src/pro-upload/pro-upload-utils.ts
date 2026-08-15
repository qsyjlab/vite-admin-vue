export interface ProUploadFileLike {
  name: string
  size: number
  type: string
}

export type ProUploadValidationError = 'accept' | 'size'

export function matchesProUploadAccept(file: ProUploadFileLike, accept?: string): boolean {
  if (!accept?.trim()) return true

  return accept.split(',').some(rule => {
    const pattern = rule.trim().toLowerCase()
    const filename = file.name.toLowerCase()
    const mimeType = file.type.toLowerCase()

    if (!pattern) return false
    if (pattern.startsWith('.')) return filename.endsWith(pattern)
    if (pattern.endsWith('/*')) return mimeType.startsWith(pattern.slice(0, -1))
    return mimeType === pattern
  })
}

export function validateProUploadFile(
  file: ProUploadFileLike,
  options: { accept?: string; maxSize?: number }
): ProUploadValidationError | undefined {
  if (!matchesProUploadAccept(file, options.accept)) return 'accept'
  if (options.maxSize && file.size > options.maxSize) return 'size'
  return undefined
}

export function cloneProUploadFiles<TFile extends object>(files: TFile[]): TFile[] {
  return files.map(file => ({ ...file }))
}
