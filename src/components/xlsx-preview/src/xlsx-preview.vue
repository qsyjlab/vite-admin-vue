<template>
  <div
    :style="{
      height
    }"
  >
    <vue-office-excel
      :src="src"
      :options="excelOptions"
      @rendered="renderedHandler"
      @error="errorHandler"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'

const props = withDefaults(
  defineProps<{
    file?: any
    height?: string
  }>(),
  {
    height: '700px'
  }
)

const src = ref()
const excelOptions = {
  // xls: false,
  // minColLength: 0,
  // minRowLength: 0,
  // widthOffset: 10,
  // heightOffset: 10,
  beforeTransformData: workbookData => {
    return workbookData
  },
  transformData: workbookData => {
    return workbookData
  }
}

watch(
  () => props.file,
  () => {
    src.value = props.file
  },
  {
    immediate: true
  }
)

function renderedHandler() {
  // console.log('渲染完成')
}
function errorHandler() {
  // console.log('渲染失败')
}
</script>
