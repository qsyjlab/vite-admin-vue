import type {
  UploadUserFile,
  UploadProgressEvent,
  UploadRequestHandler,
  UploadFile
} from 'element-plus'

export type QsUploadRequestHandler = UploadRequestHandler

export type ModelValueType = UploadUserFile

export interface CustomUploadOptions {
  // TODO: 额外参数类型添加
  onUploadProgress?: (progressEvent: UploadProgressEvent) => void
}

export interface CustomUploadFile extends UploadFile {
  response?: unknown | any
}

export interface ReactiveType {
  fileList: ModelValueType[]
}

export type CustomRequest = (
  formData?: FormData,
  options?: CustomUploadOptions
) => Promise<ResponseFile>

export interface ResponseFile {
  code: number
  data?: any
  msg: string
}
