<template>
  <component :is="render()" />
</template>
<script setup lang="tsx">
import { ElTableColumn } from 'element-plus'
import { useSlots } from 'vue'
import { useProtableInstanceContext, useTableStoreContext } from './store'
import { Tips } from '../../tips'
import { EditableCell } from './components/editable-cell'
import { resolveRenderer } from './renderer'

import type { ProTableColumnItem, ProTableProps } from './types'
import { getRowkey } from './utils'

const props = withDefaults(
  defineProps<{
    column: ProTableColumnItem
    rowKey: ProTableProps['rowKey']
  }>(),
  {}
)

const rootInstance = useProtableInstanceContext()

const slots = useSlots()

const { editableCellMap, pageQuery } = useTableStoreContext()

function columnDefaultRender(columnConfig: ProTableColumnItem, scope: any) {
  const { row, $index } = scope || {}

  if (columnConfig.children && columnConfig.children.length)
    return columnConfig.children.map(child => renderColumns(child))

  const { valueType = 'text', valueEnum, render: _render } = columnConfig

  const mergedSlots = {
    ...slots,
    ...rootInstance.slots
  }

  const realRowKey = getRowkey(row, props.rowKey)

  const renderParamters = {
    ...scope,
    editableState: realRowKey ? editableCellMap.value.get(realRowKey) : undefined
  }

  if (mergedSlots[columnConfig.key]) return mergedSlots[columnConfig.key]?.(renderParamters)

  const rowEditState = realRowKey ? editableCellMap.value.get(realRowKey) : undefined

  if (columnConfig.editable && rowEditState && rowEditState.isEdit) {
    // function onChangeEditValue(value: any) {

    //   row[columnConfig.key] = value
    // }
    return <EditableCell row={row} column={columnConfig} rowKey={props.rowKey} />
  }

  if (typeof _render === 'function') return _render(renderParamters)

  return resolveRenderer({
    valueEnum,
    valueType,
    row,
    columnConfig,
    index: $index,
    pagination: {
      page: pageQuery.page,
      pageSize: pageQuery.pageSize
    }
  })
}

const renderColumns = (item: ProTableColumnItem) => {
  const columnConfig = { ...item }

  delete columnConfig.children

  return (
    <ElTableColumn prop={String(item.key)} {...columnConfig}>
      {{
        default: (scope: any) => columnDefaultRender(item, scope),
        header: (scope: any) => {
          if (slots[`${item.key}Header`])
            return slots[`${item.key}Header`]?.({
              ...scope,
              info: item
            })
          return (
            <span class="column-header">
              <span class="column-header-title">{item.title}</span>
              {item.tip ? <Tips text={item.tip} /> : null}
            </span>
          )
        }
      }}
    </ElTableColumn>
  )
}

const render = () => {
  return renderColumns(props.column)
}
</script>

<style scoped>
.column-header {
  display: flex;
  align-items: center;
}

.column-header-title {
  margin-right: 5px;
}
</style>
