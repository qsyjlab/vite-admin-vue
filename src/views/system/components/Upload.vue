<template>
  <page-wrapper>
    <page-card style="margin-bottom: 20px" header="基础用法">
      <upload :limit="3">
        <el-button>上传</el-button>
      </upload>
    </page-card>

    <page-card header="照片墙">
      <upload list-type="picture-card" :limit="3" multiple>
        <el-icon>
          <plus />
        </el-icon>
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
import { Plus } from '@element-plus/icons-vue'

import { ref } from 'vue'
const fileList = ref([])

const fileChange = (file: File) => {
  console.log('fileChange', file)
}
</script>
