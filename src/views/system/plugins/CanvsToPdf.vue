<!--
 * @Description: canvs 转 pdf
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-25 17:01:41
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-25 17:49:07
 * @FilePath: \vite-admin-vue\src\views\system\plugins\CanvsToPdf.vue
-->

<template>
  <el-card>
    <template #header>
      {{ $route.meta.title }}
    </template>

    <div id="container" style="height: 500px">测试 container</div>

    <el-button @click="canvesToImage">htmlcanvs to imgage</el-button>
    <el-button @click="canvesToPdf">htmlcanvs to pdf</el-button>
  </el-card>
</template>
<script setup lang="ts">
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { dataURItoBlob } from '@/utils'

const transformCanvs = handler => {
  html2canvas(document.querySelector('#container') as HTMLElement, {}).then(
    (canves: HTMLCanvasElement) => {
      handler(canves)
    }
  )
}

const canvesToImage = () => {
  transformCanvs((canves: HTMLCanvasElement) => {
    window.open(window.URL.createObjectURL(dataURItoBlob(canves.toDataURL('image/jpeg', 2.0))))
  })
}

const canvesToPdf = () => {
  transformCanvs((canves: HTMLCanvasElement) => {
    const pdf = new jsPDF()

    pdf.addImage(
      canves.toDataURL('image/jpeg', 2.0),
      'JPEG',
      0,
      0,
      595.28,
      (592.28 / canves.width) * canves.height
    )

    pdf.save('pdf.pdf')
  })
}
</script>
<style scoped></style>
