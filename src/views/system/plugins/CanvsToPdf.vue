<!--
 * @Description: canvs 转 pdf
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-25 17:01:41
 * @LastEditors: qsyj
 * @LastEditTime: 2022-08-01 09:52:04
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

<script lang="ts">
export default { name: 'CanvsToPdf' }
</script>

<script setup lang="ts">
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { dataURItoBlob } from '@/utils'

const transformCanvs = (handler: any) => {
  html2canvas(document.querySelector('#container') as HTMLElement, {}).then(
    (canves: HTMLCanvasElement) => {
      handler(canves)
    }
  )
}

const canvesToImage = () => {
  transformCanvs((canves: HTMLCanvasElement) => {
    const link = document.createElement('a') //创建a标签
    link.style.display = 'none' //使其隐藏
    link.href = window.URL.createObjectURL(dataURItoBlob(canves.toDataURL('image/png', 2.0))) //赋予文件下载地址
    link.setAttribute('download', 'canves.png') //设置下载属性 以及文件名
    document.body.appendChild(link) //a标签插至页面中
    link.click() //强制触发a标签事件
    document.body.removeChild(link)
  })
}

const canvesToPdf = () => {
  transformCanvs((canves: HTMLCanvasElement) => {
    const pdf = new jsPDF()

    pdf.addImage(
      canves.toDataURL('image/png', 2.0),
      'png',
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
