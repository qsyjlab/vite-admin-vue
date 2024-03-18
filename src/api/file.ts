import { RequestMethodConfig, fileService } from '@/service'

export function uploadFile(file: File, request: RequestMethodConfig) {
  return fileService.uploadFile(
    {
      file
    },
    {
      url: '/admin/file/upload',
      onUploadProgress: request.onUploadProgress
    },
    {
      ignoreCancelRequest: true
    }
  )
}
