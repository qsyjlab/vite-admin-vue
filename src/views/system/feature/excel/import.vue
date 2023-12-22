<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <input type="file" @change="fileChange" />
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="(sheet, sheetIndex) in mutipleSheetResult"
          :key="sheetIndex"
          :label="sheet.meta.sheetName"
          :name="String(sheetIndex)"
        >
          <pro-table :columns="genTableColumns(sheet.header)" :data="sheet.results"></pro-table>
        </el-tab-pane>
      </el-tabs>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { xlsxFileReader } from '@/utils'
import { ref } from 'vue'

const mutipleSheetResult = ref<any[]>([])

const activeName = ref('0')

const fileChange = async event => {
  const file = event.target.files[0]
  const result = await xlsxFileReader(file)

  mutipleSheetResult.value = result || []
}

function genTableColumns(header: string[]) {
  return header.map(name => {
    return {
      title: name,
      key: name
    }
  })
}
</script>
<style scoped></style>
