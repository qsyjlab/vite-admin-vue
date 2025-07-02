<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <el-button type="primary" @click="print"> 打印</el-button>

      <div
        ref="tableRef"
        v-watermark="{
          content: '表格打印的水印',
          font: {
            color: 'red'
          },
          style: { position: 'fixed' }
        }"
        style="position: relative"
      >
        <table>
          <tr v-for="(_, index) in 200" :key="index">
            <td>序号列- {{ index }}</td>
            <td>姓名</td>
            <td>年龄</td>
            <td>职位</td>
            <td>其他</td>
          </tr>
        </table>
      </div>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import printJS from 'print-js'
import { ref } from 'vue'
import html2canvas from 'html2canvas'
const tableRef = ref<HTMLDivElement>()

const print = () => {
  if (tableRef.value) {
    html2canvas(tableRef.value).then(canves => {
      const image = new Image()

      image.src = canves.toDataURL()
      image.onload = () => {
        printJS({
          printable: image.src,
          type: 'image',
          header: '',
          documentTitle: 'xxx表格',
          style: `@media print { @page {size: auto; margin: 0; } body{margin:0 5px}}`
        })
      }
    })
  }
}
</script>
<style scoped>
.a {
  /* background-image: url('./'); */
  background-size: 100% 100%;
}

.watermark {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  min-height: 300px;
}
</style>
