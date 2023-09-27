<template>
  <ProTable v-bind="$attrs" :data="dataSource" :columns="proxyColumns" @register="register">
  </ProTable>
</template>
<script setup lang="ts">
import { ProTable, useProTable } from '../../pro-table'
import type { ProTableColumns } from '../../pro-table'
import type { RowKey } from '../../pro-table/src/types'
import Sortable from 'sortablejs'
import { onMounted, toRefs, computed, h, useSlots } from 'vue'
import DefaultHandle from './default-handle.vue'

interface IProps {
  data?: any[]
  columns?: ProTableColumns
  dragSortKey?: RowKey
}
const props = withDefaults(defineProps<IProps>(), {
  columns: () => [],
  data: () => []
})

const emits = defineEmits<{
  dragSortEnd: [data: any[]]
}>()

const { register, getTableRef } = useProTable()

const { data: dataSource } = toRefs(props)
const slots = useSlots()

const handlePreix = 'drag-sort-table-handle'

const proxyColumns = computed<ProTableColumns>(() => {
  return props.columns.map(column => {
    return {
      ...column,
      render(scope) {
        const { row } = scope
        const renderVNode = [slots[column.key] || column?.render?.(scope) || row[column.key]]

        if (props.dragSortKey === column.key) {
          renderVNode.unshift(
            h(DefaultHandle, { style: { marginRight: '10px' }, class: getHandleClass(column.key) })
          )
        }

        return h('div', { style: { display: 'flex', 'align-items': 'center' } }, renderVNode)
      }
    }
  })
})

onMounted(async () => {
  const tableRef = await getTableRef()
  if (tableRef) {
    const tbody = tableRef.$el.querySelector('tbody') as HTMLElement

    tbody.addEventListener('change', event => {
      event.stopPropagation()
    })

    Sortable.create(tbody, {
      handle: props.dragSortKey ? `.${getHandleClass(props.dragSortKey)}` : undefined,
      animation: 200,
      async onEnd(event) {
        const { newIndex, oldIndex } = event

        if (newIndex === undefined || oldIndex === undefined) return

        const currRow = dataSource.value.splice(oldIndex, 1)[0]
        dataSource.value.splice(newIndex, 0, currRow)

        emits('dragSortEnd', dataSource.value)
      }
    })
  }
})

function getHandleClass(key: string | number) {
  return `${handlePreix}_${key}`
}
</script>
<style scoped></style>
