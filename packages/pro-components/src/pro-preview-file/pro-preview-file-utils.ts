import type {
  ProPreviewFileKind,
  ProPreviewFileSource,
  ProPreviewFileValue
} from './pro-preview-file'

const extensionKindMap: Record<string, ProPreviewFileKind> = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  bmp: 'image',
  webp: 'image',
  svg: 'image',
  pdf: 'pdf',
  xls: 'xlsx',
  xlsx: 'xlsx',
  docx: 'docx'
}

export function getProPreviewFileKind(file?: ProPreviewFileSource | null): ProPreviewFileKind {
  if (!file) return 'unsupported'

  const mimeType = file.raw?.type || file.type || ''
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'xlsx'
  if (mimeType.includes('wordprocessingml')) return 'docx'

  const filename = file.name.split('?')[0].split('#')[0]
  const extension = filename.includes('.') ? filename.split('.').pop()?.toLowerCase() : undefined
  return extension ? extensionKindMap[extension] || 'unsupported' : 'unsupported'
}

export function getProPreviewFileValue(
  file?: ProPreviewFileSource | null
): ProPreviewFileValue | undefined {
  return file?.url || file?.raw
}
