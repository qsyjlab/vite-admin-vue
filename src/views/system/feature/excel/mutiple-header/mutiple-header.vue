<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <pro-table
        :columns="columns"
        :data="data"
        :span-method="arraySpanMethod"
        @register="register"
      >
        <template #toolbar>
          <el-button @click="exportArrToExcel">数组方式导出</el-button>
          <el-button @click="exportExecel">导出</el-button>
        </template>
      </pro-table>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { ProTableColumns, useProTable } from '@/components'
import { ref } from 'vue'
import { aoaToSheetXlsx } from '@/utils'

const data = ref<any[]>([])
const { register, getTableRef } = useProTable()

data.value = getData()
const columns: ProTableColumns = [
  {
    title: 'ID',
    key: 'id'
  },
  {
    title: '姓名',
    key: 'namer',

    children: [
      {
        title: '姓名1',
        key: 'name1',
        children: [
          {
            title: '姓名',
            key: 'name',
            children: []
          },
          {
            title: '姓名2',
            key: 'name2',
            children: []
          }
        ]
      },
      {
        title: '姓名2',
        key: 'name1',
        children: []
      }
    ]
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

const arraySpanMethod = ({ rowIndex, columnIndex }) => {
  if (rowIndex % 2 === 0) {
    if (columnIndex === 0) {
      return [1, 2]
    } else if (columnIndex === 1) {
      return [0, 0]
    }
  }
}

const exportArrToExcel = async () => {
  const tableRef = await getTableRef()

  console.log('tableRef', tableRef)
}

const exportExecel = async () => {
  const headers = {}
  columns.forEach(col => {
    headers[col.key] = col.title
  })

  const header = buildHeader(columns)
  console.log('header', header)
  const merges = doMerges(header)

  const tableRef = await getTableRef()

  aoaToSheetXlsx({
    merges,
    data: [...header, [123, 232, 233]],
    filename: '二维数组方式导出excel.xlsx'
  })

  // jsonToSheetXlsx({
  //   data: data.value,
  //   merges: doMerges,
  //   header: [],
  //   filename: `${new Date().getTime()}.xlsx`,
  //   json2sheetOpts: {
  //     header
  //   },
  //   write2excelOpts: {
  //     bookType: 'xlsx'
  //   }
  // })
}

function buildHeader(revealList: any[]) {
  let excelHeader: any[] = []
  // 构建生成excel表头需要的数据结构
  getHeader(revealList, excelHeader, 0, 0)
  // 多行表头长短不一，短的向长的看齐，不够的补上行合并占位符
  let max = Math.max(...excelHeader.map(a => a.length))
  excelHeader.filter(e => e.length < max).forEach(e => pushRowSpanPlaceHolder(e, max - e.length))
  return excelHeader
}

function getHeader(headers, excelHeader, deep, perOffset) {
  let offset = 0
  let cur = excelHeader[deep]
  if (!cur) {
    cur = excelHeader[deep] = []
  }
  // 填充行合并占位符
  pushRowSpanPlaceHolder(cur, perOffset - cur.length)
  for (let i = 0; i < headers.length; i++) {
    let head = headers[i]
    cur.push(head.title)
    if (Reflect.has(head, 'children') && Array.isArray(head.children) && head.children.length > 0) {
      let childOffset = getHeader(head.children, excelHeader, deep + 1, cur.length - 1)
      // 填充列合并占位符
      pushColSpanPlaceHolder(cur, childOffset - 1)
      offset += childOffset
    } else {
      offset++
    }
  }
  return offset
}

function pushColSpanPlaceHolder(arr, count) {
  for (let i = 0; i < count; i++) {
    arr.push('!$COL_SPAN_PLACEHOLDER')
  }
}

function pushRowSpanPlaceHolder(arr, count) {
  for (let i = 0; i < count; i++) {
    arr.push('!$ROW_SPAN_PLACEHOLDER')
  }
}

function doMerges(arr: any[]) {
  // 要么横向合并 要么纵向合并
  let deep = arr.length
  let merges: any[] = []
  for (let y = 0; y < deep; y++) {
    // 先处理横向合并
    let row = arr[y]
    let colSpan = 0
    for (let x = 0; x < row.length; x++) {
      if (row[x] === '!$COL_SPAN_PLACEHOLDER') {
        row[x] = undefined
        if (x + 1 === row.length) {
          merges.push({ s: { r: y, c: x - colSpan - 1 }, e: { r: y, c: x } })
        }
        colSpan++
      } else if (colSpan > 0 && x > colSpan) {
        merges.push({ s: { r: y, c: x - colSpan - 1 }, e: { r: y, c: x - 1 } })
        colSpan = 0
      } else {
        colSpan = 0
      }
    }
  }
  // 再处理纵向合并
  let colLength = arr[0].length
  for (let x = 0; x < colLength; x++) {
    let rowSpan = 0
    for (let y = 0; y < deep; y++) {
      if (arr[y][x] === '!$ROW_SPAN_PLACEHOLDER') {
        arr[y][x] = undefined
        rowSpan++
        if (y + 1 === deep) {
          merges.push({ s: { r: y - rowSpan, c: x }, e: { r: y, c: x } })
        }
      } else if (rowSpan > 0 && y > rowSpan) {
        merges.push({ s: { r: y - rowSpan - 1, c: x }, e: { r: y - 1, c: x } })
        rowSpan = 0
      } else {
        rowSpan = 0
      }
    }
  }
  return merges
}

function getData() {
  const tableData = [
    {
      id: '12987122',
      name: 'Tom',
      amount1: '234',
      amount2: '3.2',
      amount3: 10
    },
    {
      id: '12987123',
      name: 'Tom',
      amount1: '165',
      amount2: '4.43',
      amount3: 12
    },
    {
      id: '12987124',
      name: 'Tom',
      amount1: '324',
      amount2: '1.9',
      amount3: 9
    },
    {
      id: '12987125',
      name: 'Tom',
      amount1: '621',
      amount2: '2.2',
      amount3: 17
    },
    {
      id: '12987126',
      name: 'Tom',
      amount1: '539',
      amount2: '4.1',
      amount3: 15
    }
  ]
  return tableData
}
</script>
<style scoped></style>
