import type { Ref } from 'vue'
import type {
  UploadFile,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadRequestHandler,
  UploadUserFile
} from 'element-plus'

export type ProUploadFile<TResponse = unknown, TMeta extends object = object> = UploadUserFile &
  TMeta & {
    response?: TResponse
  }

export interface ProUploadProps<
  TResponse = unknown,
  TFile extends ProUploadFile<TResponse> = ProUploadFile<TResponse>
> extends Partial<
    Pick<
      UploadProps,
      | 'action'
      | 'accept'
      | 'autoUpload'
      | 'beforeRemove'
      | 'data'
      | 'disabled'
      | 'drag'
      | 'headers'
      | 'limit'
      | 'listType'
      | 'method'
      | 'multiple'
      | 'name'
      | 'showFileList'
      | 'withCredentials'
    >
  > {
  modelValue?: TFile[]
  maxSize?: number
  showTip?: boolean
  httpRequest?: UploadRequestHandler
  beforeUpload?: UploadProps['beforeUpload']
  preview?: (file: TFile) => boolean | void
}

export interface ProUploadExpose<
  TResponse = unknown,
  TFile extends ProUploadFile<TResponse> = ProUploadFile<TResponse>
> {
  uploadRef: Ref<UploadInstance | undefined>
  files: Readonly<Ref<TFile[]>>
  submit: () => void
  abort: (file?: UploadFile) => void
  clearFiles: (states?: Array<'ready' | 'uploading' | 'success' | 'fail'>) => void
  handleStart: (file: UploadRawFile) => void
  handleRemove: (file: UploadFile | UploadRawFile) => void
}

export type ProUploadInstance<
  TResponse = unknown,
  TFile extends ProUploadFile<TResponse> = ProUploadFile<TResponse>
> = ProUploadExpose<TResponse, TFile>
