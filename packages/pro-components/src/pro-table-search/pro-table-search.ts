import type { ColProps } from 'element-plus'
import type {
  FormFieldPath,
  FormMethodsType,
  FormModel,
  FormSchema,
  ProFormCollapsedRows
} from '../pro-form'
import type { ProTableColumn } from '../pro-table'

export interface ProTableSearchField<TQuery extends FormModel = FormModel>
  extends FormSchema<TQuery> {
  hideInSearch?: boolean
  order?: number
}

export type ProTableSearchTransform<TQuery extends FormModel, TParams extends object> = (
  values: TQuery
) => TParams | Promise<TParams>

export interface ProTableSearchProps<TQuery extends FormModel, TParams extends object = TQuery> {
  fields: ProTableSearchField<TQuery>[]
  modelValue?: TQuery
  initialValues?: TQuery
  transform?: ProTableSearchTransform<TQuery, TParams>
  omitEmpty?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
  collapsedRows?: ProFormCollapsedRows
  collapsible?: boolean
  submitterCol?: Partial<ColProps>
  loading?: boolean
  submitText?: string
  resetText?: string
  searchOnReset?: boolean
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
}

export interface ProTableSearchExpose<TQuery extends FormModel, TParams extends object = TQuery> {
  getForm: () => FormMethodsType<TQuery> | null
  getCollapsed: () => boolean
  setCollapsed: (collapsed: boolean) => void
  submit: () => Promise<TParams | undefined>
  reset: () => Promise<TParams>
  toggleCollapse: () => void
  setFieldsValue: (values: Partial<TQuery>) => Promise<void>
  getFieldsValue: (transform?: boolean) => Promise<TQuery>
}

export type ProTableSearchInstance<
  TQuery extends FormModel,
  TParams extends object = TQuery
> = ProTableSearchExpose<TQuery, TParams>

export type ProTableSearchColumn<TRecord extends object, TQuery extends FormModel> = Omit<
  ProTableColumn<TRecord>,
  'children'
> & {
  search?: boolean | Partial<ProTableSearchField<TQuery>>
  searchName?: FormFieldPath<TQuery>
  children?: ProTableSearchColumn<TRecord, TQuery>[]
}
