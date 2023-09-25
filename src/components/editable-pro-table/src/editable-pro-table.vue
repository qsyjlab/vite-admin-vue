<template>
  <div class="editable-pro-table">
    <div class="editable-pro-table__table">
      <pro-table
        :columns="presetColumns"
        :pagination="false"
        :data="dataSource"
        :editable="{
          onChange: changeHandler,
          onSave: onSaveHandler
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
            <el-button type="primary" link @click="deleteEditRow(getRowKeyValue(row))"
              >删除</el-button
            >
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
}

const props = withDefaults(defineProps<IProps>(), {
  rowKey: 'id',
  columns: () => [],
  data: () => []
})

const emits = defineEmits<{
  change: [data: any[]]
}>()

const dataSource = ref<any[]>([])

const { register, startEditable, cancelEditable, deleteEditRow, saveEditRow } = useProTable()

const presetColumns = computed(() => {
  return props.columns.map(column => {
    return {
      ...column,
      editable: true
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

const onSaveHandler: ProTableEditable['onSave'] = (row, done) => {
  done()
}

const addRowHandler = () => {
  const id = new Date().getTime()
  dataSource.value.push({
    id: id + ''
  })
  startEditable(String(id))
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
