<template>
  <div class="editable-pro-table">
    <div class="editable-pro-table__table">
      <pro-table
        :columns="presetColumns"
        :pagination="false"
        :data="dataSource"
        :editable="{
          mode,
          onSave,
          onError,
          onCancel,
          onDelete,
          onChange: changeHandler
        }"
        :options="false"
        @register="register"
      >
        <template #operation="{ row, editableState }">
          <el-space>
            <el-button
              v-if="!editableState || !editableState.isEdit"
              type="primary"
              link
              @click="startEditable(getRowKeyValue(row))"
              >编辑</el-button
            >
            <template v-else>
              <el-button type="primary" link @click="saveEditRow(getRowKeyValue(row))"
                >保存</el-button
              >
              <el-button type="primary" link @click="cancelEditable(getRowKeyValue(row))"
                >取消</el-button
              >
            </template>
            <el-popconfirm
              title="确定删除当前行数据？"
              @confirm="deleteEditRow(getRowKeyValue(row))"
            >
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </pro-table>
    </div>
    <div class="editable-pro-table__operate">
      <el-button style="width: 100%" :icon="Plus" @click="addRowHandler">添加一行数据</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import ProTable from '../../pro-table/src/pro-table.vue'

import type { ProTableColumns, ProTableEditable } from '../../pro-table/src/types'
import { ref, watch, computed } from 'vue'
import { useProTable } from '@/components/pro-table'

interface IProps {
  rowKey?: string
  columns?: ProTableColumns
  data: any[]
  /**
   * @description
   * 新增位置 顶部| 底部
   */
  appendPosition?: 'top' | 'bottom'
  /** 用于错误提示  appendError  */
  appendErrorText?: string
  mode?: ProTableEditable['mode']
  onSave?: ProTableEditable['onSave']
  onCancel?: ProTableEditable['onCancel']
  onDelete?: ProTableEditable['onDelete']
  onError?: ProTableEditable['onError']
}

const props = withDefaults(defineProps<IProps>(), {
  mode: 'multiple',
  rowKey: 'id',
  appendPosition: 'bottom',
  columns: () => [],
  data: () => []
})

const emits = defineEmits<{
  change: [data: any[]]
  appendError: [error: { message: string }]
}>()

const dataSource = ref<any[]>([])

const { register, startEditable, cancelEditable, deleteEditRow, saveEditRow, hasEditingRow } =
  useProTable()

const presetColumns = computed(() => {
  return props.columns.map(column => {
    return {
      editable: true,
      ...column
    }
  })
})

watch(
  () => props.data,
  () => {
    dataSource.value = [...props.data]
  },
  {
    immediate: true
  }
)

const changeHandler: ProTableEditable['onChange'] = data => {
  dataSource.value = data
  emits('change', dataSource.value)
}

const addRowHandler = () => {
  if (props.mode === 'single' && hasEditingRow()) {
    emits('appendError', { message: props.appendErrorText || '当前存在未保存行，请先保存！' })

    return
  }

  const id = new Date().getTime()

  const row = {
    id
  }

  if (props.appendPosition === 'top') {
    dataSource.value.unshift(row)
  } else {
    dataSource.value.push(row)
  }

  startEditable(id)
}

function getRowKeyValue(row: any) {
  if (!props.rowKey) return ''
  return row[props.rowKey]
}
</script>
<style lang="scss" scoped>
.editable-pro-table {
  &__table {
    margin-bottom: 10px;
  }
}
</style>
