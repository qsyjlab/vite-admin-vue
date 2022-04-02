<template>
  <el-upload
    ref="uploadRef"
    :name="name"
    :action="action"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :file-list="fileList"
    :before-remove="beforeRemove"
    :on-change="handleChange"
    :on-success="handleSuccess"
    :on-progress="handleProgress"
    :auto-upload="false"
    :list-type="listType"
    v-bind="{ ...$attrs, httpRequest: customRequest ? httpRequest : undefined }"
  >
    <template #default>
      <slot name="default">
        <icon-plus v-if="listType === 'picture-card'" />
        <el-button v-else name="files" type="primary"> 上传</el-button></slot
      >
    </template>
    <template #file="{ file }">
      <slot name="file" v-bind="{ file }"> </slot>
    </template>
    <!-- <template #trigger="trigger">
      <slot name="trigger" v-bind="{ trigger }"></slot>
    </template> -->
    <template #tip="tip">
      <slot name="tip" v-bind="{ tip }"></slot>
    </template>
  </el-upload>

  <preview-image ref="preview" />
</template>
<script lang="ts">
export default {
  name: 'QsUpload'
}
</script>

<script setup lang="ts">
import { ElUpload } from 'element-plus'

import { reactive, ref, toRefs, watch } from 'vue'
import PreviewImage from '../preview-image/PreviewImage.vue'

import type {
  ModelValueType,
  ReactiveType,
  CustomRequest,
  ResponseFile,
  QsUploadRequestHandler,
  CustomUploadFile
} from './upload'

interface PropsType {
  name?: string
  action?: string
  autoUpload?: boolean
  baseUrl?: string
  defaultFileList?: ModelValueType[]
  modelValue?: ModelValueType[]
  listType?: 'text' | 'picture' | 'picture-card'
  limit?: number | undefined
  customRequest?: CustomRequest | undefined
}

const props = withDefaults(defineProps<PropsType>(), {
  name: 'files',
  action: '',
  baseUrl: '',
  defaultFileList: () => [],
  modelValue: () => [],
  autoUpload: false,
  customRequest: undefined,
  listType: 'text',
  limit: undefined
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValueType[]): ModelValueType[]
  (e: 'change', value: ModelValueType[]): void
}>()

const preview = ref<typeof PreviewImage>()

const uploadRef = ref<InstanceType<typeof ElUpload>>()
// const { previewImg } = usePreview()

const state = reactive<ReactiveType>({
  fileList: []
})

const { fileList } = toRefs(state)

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return
    state.fileList = [...newVal]
  }
)

const handlePreview = file => {
  if (!preview.value?.preview) return

  preview.value.preview({ src: window.URL.createObjectURL(file.raw) })
}

// 处理文件移除事件
const handleRemove = (file: CustomUploadFile, fileList: CustomUploadFile[]) => {
  state.fileList = fileList
  state.fileList = fileList.map(item => ({
    ...item,
    ...item?.response
  }))

  emit('change', state.fileList)
  emit('update:modelValue', state.fileList)
  return true
}

/**
 * 移除
 */
const beforeRemove = () => {
  return true
}

// 处理成功请求
const handleSuccess = (response: any) => {
  response.url = props.baseUrl + response.url
}
// 处理change事件
const handleChange = (file: CustomUploadFile, fileList: CustomUploadFile[]) => {
  state.fileList = fileList.map(item => ({
    ...item,
    ...item?.response
  }))

  emit('change', state.fileList)
  emit('update:modelValue', state.fileList)
}

// 处理进度条
const handleProgress = (event: Event) => {
  return event
}

const update = async (fileList: any[]) => {
  // console.log('upldate', fileList)

  if (!props.customRequest) {
    await emit('change', fileList)
    await emit('update:modelValue', fileList)
    return
  } else {
    const emitsFile = fileList.map(item => item?.response)
    await emit('change', emitsFile)
    await emit('update:modelValue', emitsFile)
  }
}

// http自定义上传
const httpRequest: QsUploadRequestHandler = info => {
  console.log('asdasd')

  const { data, filename, onProgress, file } = info

  if (props.customRequest) {
    const formdata = new FormData()
    formdata.append(filename, file)

    Object.entries(data).forEach(([key, value]: [string, any]) => {
      formdata.append(key, value)
    })
    return props
      .customRequest(formdata, {
        onUploadProgress: progressEvent => {
          let percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0

          //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          onProgress({
            ...progressEvent,
            percent
          })
        }
      })
      .then((res: ResponseFile) => res?.data)
  }

  return Promise.resolve()
}

// 对外重置的方法
const resetValue = () => {
  state.fileList = []
  update(state.fileList)
}
</script>

<style scoped></style>
