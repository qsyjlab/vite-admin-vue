import { ElIcon, ElTableColumn, ElTooltip } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { defineComponent, h, type Component, type PropType, type Slots, type VNodeChild } from 'vue'
import type { ProTableColumn, ProTableEditableRowState, ProTableRenderScope } from '../pro-table'
import { getProTableColumnKey, getProTableColumnProp } from '../pro-table-utils'
import ProTableCell from './pro-table-cell.vue'

type TableRecord = Record<string, unknown>

interface ProTableColumnRendererProps {
  column: ProTableColumn<TableRecord>
  tableSlots?: Slots
  dragHandle?: boolean
  getEditableState?: (row: TableRecord) => ProTableEditableRowState<TableRecord> | undefined
  updateEditableValue?: (
    row: TableRecord,
    column: ProTableColumn<TableRecord>,
    value: unknown
  ) => void
  customRenderAfter?: (value: VNodeChild, scope: ProTableRenderScope<TableRecord>) => VNodeChild
}

export const ProTableColumnRenderer = defineComponent({
  name: 'ProTableColumn',
  props: {
    column: {
      type: Object as PropType<ProTableColumn<TableRecord>>,
      required: true
    },
    tableSlots: Object as PropType<Slots>,
    dragHandle: Boolean,
    getEditableState: Function as PropType<
      (row: TableRecord) => ProTableEditableRowState<TableRecord> | undefined
    >,
    updateEditableValue: Function as PropType<
      (row: TableRecord, column: ProTableColumn<TableRecord>, value: unknown) => void
    >,
    customRenderAfter: Function as PropType<
      (value: VNodeChild, scope: ProTableRenderScope<TableRecord>) => VNodeChild
    >
  },
  setup(props) {
    return () => renderColumn(props)
  }
})

function renderColumn(props: Readonly<ProTableColumnRendererProps>) {
  const column = props.column
  const children = column.children?.filter(child => !child.hideInTable) ?? []
  const columnProps = getElementColumnProps(column)

  return h(ElTableColumn, columnProps, {
    default: children.length
      ? () => children.map(child => renderChildColumn(child, props))
      : (scope?: { row?: TableRecord; $index?: number }) => renderCell(scope, props),
    header: column.tip ? () => renderColumnHeader(column) : undefined
  })
}

function renderChildColumn(
  column: ProTableColumn<TableRecord>,
  props: Readonly<ProTableColumnRendererProps>
) {
  return h(ProTableColumnRenderer, {
    key: getProTableColumnKey(column),
    column,
    tableSlots: props.tableSlots,
    dragHandle: props.dragHandle,
    getEditableState: props.getEditableState,
    updateEditableValue: props.updateEditableValue,
    customRenderAfter: props.customRenderAfter
  })
}

function renderCell(
  scope: { row?: TableRecord; $index?: number } | undefined,
  props: Readonly<ProTableColumnRendererProps>
) {
  const { row, $index = 0 } = scope ?? {}
  if (!row || $index < 0) return []
  return h(ProTableCell as Component, {
    row,
    index: $index,
    column: props.column,
    tableSlots: props.tableSlots,
    dragHandle: props.dragHandle,
    editableState: props.getEditableState?.(row),
    updateEditableValue: props.updateEditableValue,
    customRenderAfter: props.customRenderAfter
  })
}

function renderColumnHeader(column: ProTableColumn<TableRecord>) {
  return h('span', { class: 'pro-table-column-header' }, [
    h('span', column.title),
    h(
      ElTooltip,
      { content: column.tip, placement: 'top' },
      {
        default: () => h(ElIcon, { class: 'pro-table-column-header__tip' }, () => h(QuestionFilled))
      }
    )
  ])
}

function getElementColumnProps(column: ProTableColumn<TableRecord>) {
  const {
    children: _children,
    dataIndex: _dataIndex,
    editable: _editable,
    editableRules: _editableRules,
    emptyText: _emptyText,
    fieldProps: _fieldProps,
    formatter: _formatter,
    hideInTable: _hideInTable,
    key: _key,
    render: _render,
    rowComponent: _rowComponent,
    serverFilter: _serverFilter,
    serverSort: _serverSort,
    tip: _tip,
    title: _title,
    valueEnum: _valueEnum,
    valueType: _valueType,
    ...tableColumnProps
  } = column
  return {
    ...tableColumnProps,
    columnKey: getProTableColumnKey(column),
    label: column.title,
    prop: getProTableColumnProp(column),
    sortable: column.serverSort ? 'custom' : tableColumnProps.sortable
  }
}
