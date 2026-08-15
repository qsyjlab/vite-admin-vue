import type { TagProps, UploadStatus } from 'element-plus'

export interface ProUploadStatusMeta {
  text: string
  type: TagProps['type']
}

export const proUploadStatusMap: Record<UploadStatus, ProUploadStatusMeta> = {
  ready: { text: '待上传', type: 'info' },
  uploading: { text: '上传中', type: 'primary' },
  success: { text: '上传成功', type: 'success' },
  fail: { text: '上传失败', type: 'danger' }
}

export function normalizeProUploadPercentage(percentage?: number): number {
  if (!Number.isFinite(percentage)) return 0
  return Math.min(100, Math.max(0, Math.round(percentage || 0)))
}
