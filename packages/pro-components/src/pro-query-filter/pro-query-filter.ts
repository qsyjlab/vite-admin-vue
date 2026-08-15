import type { FormModel, ProFormCollapsedRows } from '../pro-form'
import type {
  ProTableSearchExpose,
  ProTableSearchField,
  ProTableSearchInstance,
  ProTableSearchProps,
  ProTableSearchTransform
} from '../pro-table-search'

export interface ProQueryFilterProps<TQuery extends FormModel, TParams extends object = TQuery>
  extends Omit<
    ProTableSearchProps<TQuery, TParams>,
    | 'fields'
    | 'modelValue'
    | 'initialValues'
    | 'transform'
    | 'loading'
    | 'collapsed'
    | 'defaultCollapsed'
    | 'collapsedRows'
  > {
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

export interface ProQueryFilterExpose<TQuery extends FormModel, TParams extends object = TQuery>
  extends ProTableSearchExpose<TQuery, TParams> {
  getSearch: () => ProTableSearchInstance<TQuery, TParams> | undefined
  getActiveCount: () => number
  clear: () => Promise<TParams | undefined>
}

export type ProQueryFilterInstance<
  TQuery extends FormModel,
  TParams extends object = TQuery
> = ProQueryFilterExpose<TQuery, TParams>
