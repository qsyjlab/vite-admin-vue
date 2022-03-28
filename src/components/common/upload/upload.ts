/*
 * @Description:
 * @Version:
 * @Autor: qsyj
 * @Date: 2022-03-28 15:33:34
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-28 22:52:10
 */

import type {
  UploadUserFile,
  UploadProgressEvent,
  UploadRequestHandler,
  UploadFile
} from 'element-plus'

import { ref, onMounted } from 'vue'

import PreviewImage from '../preview-image/PreviewImage.vue'

export type QsUploadRequestHandler = UploadRequestHandler

export type ModelValueType = UploadUserFile | never

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
