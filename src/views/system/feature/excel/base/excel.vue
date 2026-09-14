<template>
  <page-wrapper class="excel-base-page">
    <g-page-header
      title="基本导出"
      description="演示 aoaToSheetXlsx（二维数组）与 jsonToSheetXlsx（JSON + 指定列）两种导出方式。"
      :icon="Download"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">二维数组</el-tag>
        <el-tag effect="plain" type="success">JSON</el-tag>
      </template>
    </g-page-header>

    <pro-card :body-padding="false">
      <pro-table :columns="columns" :data="data">
        <template #toolbar>
          <el-button @click="exportArrToExcel">数组方式导出</el-button>
          <el-button @click="exportExecel">导出</el-button>
        </template>
      </pro-table>
    </pro-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'
import type { ProTableColumns } from '@framebase/element-plus-pro-components'
import { ref } from 'vue'
import { GPageHeader, PageWrapper } from '@/components'
import { aoaToSheetXlsx, jsonToSheetXlsx } from '@/utils'

const data = ref<any[]>([])

import * as XLSX from 'xlsx'

const dataSource = [
  {
    dictLabel: '检举控告',
    dictValue: 'petition_attrs_1'
  },

  {
    dictLabel: '其他',
    dictValue: 'petition_attrs_2'
  }
]

const worksheet = XLSX.utils.json_to_sheet(dataSource)
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, '岗位列表')

XLSX.writeFile(workbook, 'positionWithinGroupList.xlsx')

data.value = getData()
const columns: ProTableColumns<Record<string, unknown>> = [
  {
    title: 'ID',
    key: 'id'
  },
  {
    title: '姓名',
    key: 'name'
  },

  {
    title: '年龄',
    key: 'age'
  },
  {
    title: '编号',
    key: 'code'
  },
  {
    title: '地址',
    key: 'address'
  },
  {
    title: '开始时间',
    key: 'startTime'
  },
  {
    title: '结束时间',
    key: 'endTime'
  }
]

const exportArrToExcel = () => {
  aoaToSheetXlsx({
    data: getPureArrayData(),
    header: columns.map(col => col.title),
    filename: '二维数组方式导出excel.xlsx'
  })
}

const exportExecel = () => {
  const headers = {}
  columns.forEach(col => {
    headers[col.key] = col.title
  })

  jsonToSheetXlsx({
    data: data.value,
    header: headers,
    filename: `${new Date().getTime()}.xlsx`,
    json2sheetOpts: {
      header: ['name', 'id']
    },
    write2excelOpts: {
      bookType: 'xlsx'
    }
  })
}

function getData() {
  const arr: any[] = []
  for (let index = 0; index < 40; index++) {
    arr.push({
      id: `${index}`,
      name: `${index} John Brown`,
      age: `${index + 10}`,
      code: `${index}98678`,
      address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
      startTime: new Date().toLocaleString(),
      endTime: new Date().toLocaleString()
    })
  }
  return arr
}

function getPureArrayData() {
  return data.value.map(item => {
    return Object.keys(item).map(key => item[key])
  })
}
</script>
<style scoped lang="scss">
.excel-base-page {
  gap: 16px;
}
</style>
