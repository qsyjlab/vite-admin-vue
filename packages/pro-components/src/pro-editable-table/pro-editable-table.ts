import type {
  ProTableColumns,
  ProTableEditable,
  ProTableEditableRowKey,
  ProTableExpose,
  ProTableOptions,
  ProTableProps,
  ProTableRowKey
} from '../pro-table'

export type ProEditableTableTableProps<TRecord extends object> = Pick<
  ProTableProps<TRecord, Record<string, never>>,
  | 'loading'
  | 'checkable'
  | 'reserveSelection'
  | 'selectedKeys'
  | 'cacheSelectedData'
  | 'headerTitle'
  | 'columnsState'
  | 'indexBorder'
  | 'dragSort'
  | 'customRenderAfter'
  | 'showAlert'
  | 'alwaysShowAlert'
  | 'height'
  | 'size'
  | 'border'
  | 'tableLayout'
>

export interface ProEditableTableProps<TRecord extends object>
  extends ProEditableTableTableProps<TRecord> {
  modelValue?: TRecord[]
  data?: TRecord[]
  columns?: ProTableColumns<TRecord>
  tableProps?: ProEditableTableTableProps<TRecord>
  rowKey?: ProTableRowKey<TRecord>
  autoFitHeight?: boolean
  appendPosition?: 'top' | 'bottom'
  appendErrorText?: string
  mode?: ProTableEditable<TRecord>['mode']
  editable?: ProTableEditable<TRecord>
  onSave?: ProTableEditable<TRecord>['onSave']
  onCancel?: ProTableEditable<TRecord>['onCancel']
  onDelete?: ProTableEditable<TRecord>['onDelete']
  onError?: ProTableEditable<TRecord>['onError']
  createRow?: () => TRecord
  operationKey?: string
  showActions?: boolean
  showAddButton?: boolean
  options?: boolean | ProTableOptions
}

export interface ProEditableTableExpose<TRecord extends object> {
  getData: () => TRecord[]
  getEditableKeys: () => ProTableEditableRowKey[]
  addRow: () => Promise<TRecord | undefined>
  startEditable: ProTableExpose<TRecord>['startEditable']
  cancelEditable: ProTableExpose<TRecord>['cancelEditable']
  saveEditable: ProTableExpose<TRecord>['saveEditable']
  deleteEditable: ProTableExpose<TRecord>['deleteEditable']
  getRowEditableState: ProTableExpose<TRecord>['getRowEditableState']
  clearEditRows: ProTableExpose<TRecord>['clearEditRows']
  hasEditingRow: ProTableExpose<TRecord>['hasEditingRow']
  validateEditable: ProTableExpose<TRecord>['validateEditable']
  saveAllEditable: ProTableExpose<TRecord>['saveAllEditable']
  cancelAllEditable: ProTableExpose<TRecord>['cancelAllEditable']
  clearSelection: ProTableExpose<TRecord>['clearSelection']
  clearSelectedKeys: ProTableExpose<TRecord>['clearSelectedKeys']
  getSelectedRows: ProTableExpose<TRecord>['getSelectedRows']
  doLayout: ProTableExpose<TRecord>['doLayout']
  doHeight: ProTableExpose<TRecord>['doHeight']
}

export type ProEditableTableInstance<TRecord extends object> = ProEditableTableExpose<TRecord>
