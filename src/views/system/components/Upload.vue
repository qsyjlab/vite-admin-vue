<template>
  <page-wrapper>
    <page-card :full="false" style="margin-bottom: 20px" header="基础用法">
      <upload v-model="fileList" :limit="3">
        <el-button>上传</el-button>
      </upload>
    </page-card>

    <page-card :full="false" style="margin-bottom: 20px" header="照片墙">
      <pre>
        {{ pictureCard }}
      </pre>
      <upload
        v-model="pictureCard"
        :http-request="httpRequest"
        list-type="picture-card"
        :limit="3"
        multiple
        @change="fileChange"
      >
        <el-icon>
          <plus />
        </el-icon>
      </upload>
    </page-card>

    <page-card :full="false" header="拖拽上传">
      <upload v-model="fileList" :limit="3" multiple drag>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      </upload>
    </page-card>
  </page-wrapper>
</template>

<script lang="ts">
export default { name: 'Upload' }
</script>

<script setup lang="ts">
import { PageWrapper } from '@/components/page-wrapper'
import { PageCard } from '@/components/page-card'
import { Upload } from '@/components/upload'
import { Plus, UploadFilled } from '@element-plus/icons-vue'

import { ref } from 'vue'
import { UploadProps } from 'element-plus'

const fileList = ref([])

const pictureCard = ref([])

const fileChange = (file: any) => {
  console.log('fileChange', file)
}

const httpRequest: UploadProps['httpRequest'] = options => {
  return Promise.resolve({
    url: URL.createObjectURL(options.file)
  })
}
</script>
