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

export function requestBlob() {
  return fileService.request(
    {
      url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
      responseType: 'blob'
    },
    {
      ignoreTransformResponse: true
    }
  )
}
