<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <el-space>
        <el-button type="primary" @click="downloadBlob">文件流下载</el-button>
        <el-button type="primary" @click="downloadUrl">文件地址下载</el-button>
        <el-button type="primary" @click="requestBlob()">请求拦截器</el-button>
      </el-space>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { downloadFileStream, convertUnknownObjectToBlob } from '@/utils'
import { requestBlob } from '@/api/file'

const downloadBlob = () => {
  downloadFileStream(new Blob(['内容']))
}

const downloadUrl = async () => {
  const blob = await convertUnknownObjectToBlob(
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
  )
  if (blob) {
    downloadFileStream(blob)
  }
}
</script>
<style scoped></style>
