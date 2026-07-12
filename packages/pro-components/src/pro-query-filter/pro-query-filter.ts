import type { FormModel, ProFormCollapsedRows } from '../pro-form'
import type { ProTableSearchField, ProTableSearchTransform } from '../pro-table-search'

export interface ProQueryFilterProps<TQuery extends FormModel, TParams extends object = TQuery> {
  fields: ProTableSearchField<TQuery>[]
  modelValue?: TQuery
  initialValues?: TQuery
  transform?: ProTableSearchTransform<TQuery, TParams>
  loading?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
  collapsedRows?: ProFormCollapsedRows
  showActiveCount?: boolean
  clearText?: string
}
