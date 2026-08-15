<template>
  <ProTable
    ref="tableRef"
    v-model:loading="loading"
    header-title="可编辑行"
    :columns="columns"
    :request="request"
    :editable="{ mode: 'single', enableValidate: true, onSave, onDelete }"
  >
    <template #action="{ row, editableState }">
      <el-button v-if="!editableState" link type="primary" @click="table.startEditable(row.id)">
        编辑
      </el-button>
      <template v-else>
        <el-button link type="primary" @click="table.saveEditable(row.id)">保存</el-button>
        <el-button link @click="table.cancelEditable(row.id)">取消</el-button>
      </template>
      <el-button link type="danger" @click="table.deleteEditable(row.id)">删除</el-button>
    </template>
  </ProTable>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import {
  ProTable,
  useProTable,
  type ProTableColumns,
  type ProTableInstance,
  type ProTableRequestResult
} from '@framebase/element-plus-pro-components'

interface UserRecord {
  id: number
  name: string
  address: string
}

const loading = ref(false)
const tableRef = useTemplateRef<ProTableInstance<UserRecord>>('tableRef')
const table = useProTable(tableRef)
const columns: ProTableColumns<UserRecord> = [
  {
    title: '姓名',
    key: 'name',
    dataIndex: 'name',
    editable: true,
    rowComponent: { el: 'el-input' }
  },
  {
    title: '地址',
    key: 'address',
    dataIndex: 'address',
    editable: true,
    rowComponent: { el: 'el-input' }
  },
  { title: '操作', key: 'action', fixed: 'right', width: 180 }
]

async function request(): Promise<ProTableRequestResult<UserRecord>> {
  return {
    data: [
      { id: 1, name: 'Tom', address: '上海市浦东新区' },
      { id: 2, name: 'Jerry', address: '杭州市西湖区' }
    ],
    total: 2
  }
}

async function onSave(row: UserRecord) {
  return { ...row, name: row.name.trim() }
}

async function onDelete() {
  return true
}
</script>
