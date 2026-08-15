import type { Ref } from 'vue'
import type { UploadStatus } from 'element-plus'
import type { ProUploadFile } from '../pro-upload'

export type ProUploadListMode = 'upload' | 'preview'

export type ProUploadListFile<TResponse = unknown, TMeta extends object = object> = ProUploadFile<
  TResponse,
  TMeta
> & {
  status?: UploadStatus
  error?: unknown
}

export interface ProUploadRequestContext<TFile> {
  file: TFile
  signal: AbortSignal
  onProgress: (percentage: number) => void
}

export type ProUploadRequest<TResponse, TFile> = (
  rawFile: File,
  context: ProUploadRequestContext<TFile>
) => Promise<TResponse>

export interface ProUploadListProps<
  TResponse = unknown,
  TFile extends ProUploadListFile<TResponse> = ProUploadListFile<TResponse>
> {
  modelValue?: TFile[]
  request?: ProUploadRequest<TResponse, TFile>
  mapResponse?: (response: TResponse, file: TFile) => Partial<TFile>
  multiple?: boolean
  autoUpload?: boolean
  accept?: string
  maxSize?: number
  limit?: number
  disabled?: boolean
  readonly?: boolean
  title?: string
}

export interface ProUploadListExpose<
  TResponse = unknown,
  TFile extends ProUploadListFile<TResponse> = ProUploadListFile<TResponse>
> {
  visible: Ref<boolean>
  mode: Ref<ProUploadListMode>
  files: Readonly<Ref<TFile[]>>
  open: () => void
  openPreview: () => void
  close: () => void
  upload: (file: TFile) => Promise<boolean>
  uploadAll: () => Promise<boolean[]>
  abort: (file?: TFile) => void
  retry: (file: TFile) => Promise<boolean>
  remove: (file: TFile) => void
  clear: () => void
}

export type ProUploadListInstance<
  TResponse = unknown,
  TFile extends ProUploadListFile<TResponse> = ProUploadListFile<TResponse>
> = ProUploadListExpose<TResponse, TFile>
