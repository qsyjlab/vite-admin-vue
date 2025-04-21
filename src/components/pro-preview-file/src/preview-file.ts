import type { UploadUserFile } from 'element-plus'
import { isImage as _isImage, isXlsx as _isXlsx } from '@/utils'

export function isImage(file: UploadUserFile) {
  return _isImage(file.name)
}

export function isXlsx(file: UploadUserFile) {
  return _isXlsx(file.name)
}
