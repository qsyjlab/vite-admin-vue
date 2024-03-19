<template>
  <span>
    <el-space>
      <el-button :icon="UploadFilled" type="primary" @click="showUploadList">上传</el-button>
      <el-button :icon="View" @click="showPreviewList"></el-button>
    </el-space>

    <el-dialog v-bind="dialogAttrs" v-model="uploadListState.visible">
      <div style="margin-bottom: 10px">
        <div v-if="uploadListState.mode === 'upload'">
          <upload
            :multiple="multiple"
            :show-tip="false"
            :show-file-list="false"
            :auto-upload="false"
            :file-list="uploadListState.fileList"
            @change="fileChangeHandler"
          >
            <el-button type="primary">选择文件</el-button>
          </upload>
        </div>
      </div>
      <pro-table
        :columns="columns"
        :options="false"
        :data="uploadListState.fileList"
        :pagination="false"
      />

      <template #footer>
        <el-space>
          <el-button @click="closeUploadList">关闭</el-button>
          <el-button
            v-if="uploadListState.mode === 'upload'"
            :disabled="uploadListState.fileList.length === 0"
            type="primary"
            @click="startUploadFileList"
            >开始上传</el-button
          >
        </el-space>
      </template>
    </el-dialog>

    <pro-preview-file ref="previewRef"></pro-preview-file>
  </span>
</template>
<script setup lang="ts">
import { UploadFilled, View } from '@element-plus/icons-vue'
import { ProTable, ProTableColumns } from '@/components/pro-table'
import { Upload } from '@/components/upload'
import { ProPreviewFile, ProPreviewFileInstance } from '@/components/pro-preview-file'
import { computed, h, reactive, ref, toRaw, watch } from 'vue'
import {
  DialogProps,
  ElTag,
  UploadInstance,
  UploadUserFile,
  UploadProps,
  ElSpace,
  ElButton,
  ElPopconfirm
} from 'element-plus'
import { bytesToSize, convertUnknownObjectToBlob, downloadFile } from '@/utils'
import { uploadFile } from '@/api/file'
import { UploadStatusEnum, uploadStatusMap } from './upload-list'

interface IProps extends Pick<UploadProps, 'multiple' | 'autoUpload'> {
  modelValue?: any[]
}

const emits = defineEmits<{
  'update:model-value': [files: UploadUserFile[]]
}>()
const props = withDefaults(defineProps<IProps>(), {
  multiple: true,
  autoUpload: false
})

const previewRef = ref<ProPreviewFileInstance>()

const uploadListState = reactive<{
  visible: boolean
  mode: 'preview' | 'upload' | ''
  fileList: UploadInstance['fileList']
}>({
  mode: '',
  visible: false,
  fileList: []
})

const isPreivew = computed(() => uploadListState.mode === 'preview')

const dialogAttrs = computed<Partial<DialogProps>>(() => {
  return {
    closeOnClickModal: false,
    closeOnPressEscape: false,
    title: uploadListState.mode === 'preview' ? '预览' : '上传'
  }
})

const columns: ProTableColumns<UploadUserFile> = [
  {
    title: '文件名',
    key: 'name',
    showOverflowTooltip: true
  },
  {
    title: '文件大小',
    key: 'size',
    render: ({ row }) => {
      return bytesToSize(row.size || 0)
    }
  },
  {
    title: '上传进度',
    key: 'percentage',
    valueType: 'progress'
  },
  {
    title: '状态',
    key: 'status',
    render: ({ row }) => {
      const props: Record<string, any> = row.status ? uploadStatusMap[row.status] : {}
      return h(ElTag, props, () => props.text)
    }
  },
  {
    title: '操作',
    key: 'action',
    render: ({ $index, row }) => {
      const vnodes = [
        h(
          ElButton,
          {
            type: 'primary',
            link: true,
            onClick: () => {
              previewHandler(row)
            }
          },
          () => '预览'
        ),
        h(
          ElButton,
          {
            type: 'primary',
            link: true,
            onClick: async () => {
              if (!row.url) return

              const blob = await convertUnknownObjectToBlob(row.url)
              if (!blob) return

              downloadFile(URL.createObjectURL(blob), row.name)
            }
          },
          () => '下载'
        )
      ]
      if (!isPreivew.value) {
        vnodes.push(
          h(
            ElPopconfirm,
            {
              title: '确认删除此项数据？',
              onConfirm: () => {
                removeFileHandler([$index])
              }
            },
            {
              reference: () => h(ElButton, { type: 'danger', link: true }, () => '删除')
            }
          )
        )
      }
      return h(ElSpace, {}, () => vnodes)
    }
  }
]

watch(
  () => props.modelValue,
  () => {
    uploadListState.fileList =
      props.modelValue?.map(file => {
        const status = file.status || UploadStatusEnum.SUCCESS
        return {
          ...file,
          status,
          percentage: status === UploadStatusEnum.SUCCESS ? 100 : 0
        }
      }) || []
  },
  {
    immediate: true
  }
)

const startUploadFileList = async () => {
  const uploadFileList =
    uploadListState.fileList.filter(item => item.status !== UploadStatusEnum.SUCCESS) || []
  await Promise.all(
    uploadFileList.map(item => {
      return fileUploadHandler(item)
    })
  )

  emitUpdate()
}

const showUploadList = () => {
  uploadListState.visible = true
  uploadListState.mode = 'upload'
}

const showPreviewList = () => {
  uploadListState.visible = true
  uploadListState.mode = 'preview'
}

const fileChangeHandler: UploadInstance['onChange'] = (file, files) => {
  uploadListState.fileList = files.map(file => {
    return {
      ...file,
      url: file.raw ? URL.createObjectURL(file.raw) : ''
    }
  })

  emitUpdate()
}

const closeUploadList = () => {
  uploadListState.visible = false
}

async function fileUploadHandler(file: UploadUserFile) {
  try {
    file.status = UploadStatusEnum.UPLOADING
    const ret = await uploadFile(file.raw as File, {
      onUploadProgress: event => {
        const complete = (event.loaded / (event.total || 0)) * 100 || 0

        file.percentage = complete
      }
    })
    const { data } = ret
    file.status = UploadStatusEnum.SUCCESS
    file.response = data

    Object.keys(data).forEach(key => {
      file[key] = data[key]
    })

    return {
      success: true,
      error: null
    }
  } catch (e) {
    console.log(e)
    file.status = UploadStatusEnum.FAIL
    return {
      success: false,
      error: e
    }
  }
}

function removeFileHandler(index: number[]) {
  index.forEach(item => {
    uploadListState.fileList.splice(item, 1)
  })
  emitUpdate()
}

function previewHandler(row: UploadUserFile) {
  previewRef.value?.show(row)
}

function emitUpdate() {
  emits('update:model-value', toRaw(uploadListState.fileList))
}
</script>
