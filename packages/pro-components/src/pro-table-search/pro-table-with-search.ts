import type { FormModel } from '../pro-form'
import type {
  ProTableColumn,
  ProTableInstance,
  ProTableProps,
  ProTableRequestResult
} from '../pro-table'
import type {
  ProTableSearchField,
  ProTableSearchInstance,
  ProTableSearchProps
} from './pro-table-search'

export interface ProTableWithSearchProps<
  TRecord extends object,
  TQuery extends FormModel,
  TResponse = ProTableRequestResult<TRecord>
> {
  columns: ProTableColumn<TRecord>[]
  searchFields: ProTableSearchField<TQuery>[]
  request?: ProTableProps<TRecord, TQuery, TResponse>['request']
  params?: TQuery
  initialValues?: TQuery
  tableProps?: Partial<ProTableProps<TRecord, TQuery, TResponse>>
  searchProps?: Partial<
    Omit<ProTableSearchProps<TQuery, Partial<TQuery>>, 'fields' | 'initialValues' | 'modelValue'>
  >
}

export interface ProTableWithSearchExpose<TRecord extends object, TQuery extends FormModel> {
  getTable: () => ProTableInstance<TRecord> | null
  getSearch: () => ProTableSearchInstance<TQuery, Partial<TQuery>> | null
  submit: () => Promise<Partial<TQuery> | undefined>
  reset: () => Promise<Partial<TQuery>>
  getCollapsed: () => boolean
  setCollapsed: (collapsed: boolean) => void
  toggleCollapse: () => void
  reload: () => Promise<TRecord[]>
}
