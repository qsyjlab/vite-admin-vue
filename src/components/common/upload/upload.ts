/*
 * @Description:
 * @Version:
 * @Autor: qsyj
 * @Date: 2022-03-28 15:33:34
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-28 17:53:00
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

/**
 * 图片预览
 * @returns
 */
export const usePreview = () => {
  const preview = ref<InstanceType<typeof PreviewImage>>()

  onMounted(() => {
    console.log('preview', preview)
  })

  function previewImg(src: string) {
    console.log('preview', preview)
  }

  return {
    previewImg
  }
}
