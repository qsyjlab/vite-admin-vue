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
import { getRowkey, renderHelper } from './utils'

const props = withDefaults(
  defineProps<{
    column: ProTableColumnItem
    rowKey: ProTableProps['rowKey']
  }>(),
  {}
)

const rootInstance = useProtableInstanceContext()

const slots = useSlots()

const { pageQuery, customRendererMap, customRenderAfter, editableCellUtils } =
  useTableStoreContext()

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
  const rowEditState = editableCellUtils.getRowEditableState(realRowKey)

  const renderParamters = {
    ...scope,
    editableState: rowEditState
  }

  if (mergedSlots[columnConfig.key]) return mergedSlots[columnConfig.key]?.(renderParamters)

  if (columnConfig.editable && rowEditState && rowEditState.isEdit) {
    return <EditableCell row={row} column={columnConfig} rowKey={props.rowKey} />
  }

  if (typeof _render === 'function') {
    return renderHelper(_render(renderParamters), customRenderAfter)
  }

  return renderHelper(
    resolveRenderer({
      valueEnum,
      valueType,
      row,
      columnConfig,
      index: $index,
      customRendererMap,
      pagination: {
        page: pageQuery.page,
        pageSize: pageQuery.pageSize
      }
    }),
    customRenderAfter
  )
}

const renderColumns = (item: ProTableColumnItem) => {
  const columnConfig = { ...item }

  delete columnConfig.children

  return (
    <ElTableColumn prop={String(item.key)} {...columnConfig}>
      {{
        default: (scope: any) => columnDefaultRender(item, scope),
        header: () => {
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
