import { shallowRef } from 'vue'
import {
  ProCard,
  ProConfigProvider,
  ProDescriptions,
  ProField,
  ProForm,
  ProList,
  ProSelect,
  ProTable,
  useProDescriptions,
  useProForm,
  useProList,
  useProSelect,
  useProTable,
  type FormMethodsType,
  type ProDescriptionColumns,
  type ProDescriptionsInstance,
  type ProFormInstance,
  type ProListInstance,
  type ProSelectInstance,
  type ProTableColumns,
  type ProTableInstance,
  type ProTableRequestParams,
  type ProTableRequestResult
} from '@vite-admin/pro-components'

type Equal<TLeft, TRight> =
  (<T>() => T extends TLeft ? 1 : 2) extends <T>() => T extends TRight ? 1 : 2 ? true : false
type Expect<TValue extends true> = TValue

interface UserRecord {
  id: number
  profile: {
    name: string
  }
  status: 'active' | 'disabled'
}

interface UserQuery {
  keyword?: string
}

interface UserFormModel {
  user: {
    name: string
  }
  enabled: boolean
}

interface UserOption {
  label: string
  value: number
  department: string
}

const columns = [
  { key: 'name', title: '姓名', dataIndex: 'profile.name' },
  { key: 'status', title: '状态', dataIndex: ['status'] }
] satisfies ProTableColumns<UserRecord>

const descriptionColumns = [
  { key: 'name', label: '姓名', dataIndex: 'profile.name' },
  { key: 'status', label: '状态', dataIndex: ['status'] }
] satisfies ProDescriptionColumns<UserRecord>

const tableRef = shallowRef<ProTableInstance<UserRecord> | null>(null)
const table = useProTable(tableRef)
type TableDataResult = Expect<Equal<Awaited<ReturnType<typeof table.getData>>, UserRecord[]>>
type TableServerStateResult = Expect<
  Equal<Awaited<ReturnType<typeof table.getServerState>>['filters'], Record<string, unknown[]>>
>

const listRef = shallowRef<ProListInstance<UserRecord> | null>(null)
const list = useProList(listRef)
type ListDataResult = Expect<Equal<Awaited<ReturnType<typeof list.getData>>, UserRecord[]>>
type ListRequestPhaseResult = Expect<
  Equal<
    Awaited<ReturnType<typeof list.getRequestLifecycle>>['phase'],
    'idle' | 'pending' | 'success' | 'error'
  >
>

const descriptionsRef = shallowRef<ProDescriptionsInstance<UserRecord, UserQuery> | null>(null)
const descriptions = useProDescriptions(descriptionsRef)
type DescriptionsDataResult = Expect<
  Equal<Awaited<ReturnType<typeof descriptions.getData>>, UserRecord | undefined>
>
type DescriptionsRequestPhaseResult = Expect<
  Equal<Awaited<ReturnType<typeof descriptions.getRequestLifecycle>>['loading'], boolean>
>

const selectRef = shallowRef<ProSelectInstance<UserOption, UserQuery> | null>(null)
const select = useProSelect(selectRef)
type SelectOptionsResult = Expect<Equal<Awaited<ReturnType<typeof select.reload>>, UserOption[]>>
type SelectRequestPhaseResult = Expect<
  Equal<Awaited<ReturnType<typeof select.getRequestLifecycle>>['refreshing'], boolean>
>

const formRef = shallowRef<ProFormInstance<UserFormModel> | null>(null)
const form = useProForm(formRef)
type FormValuesResult = Expect<
  Equal<Awaited<ReturnType<typeof form.getFieldsValue>>, UserFormModel>
>
type FormInstanceContract = Expect<
  Equal<ProFormInstance<UserFormModel>, FormMethodsType<UserFormModel>>
>
type FormDirtyResult = Expect<Equal<Awaited<ReturnType<typeof form.isDirty>>, boolean>>

async function requestUsers(
  params: ProTableRequestParams<UserQuery>
): Promise<ProTableRequestResult<UserRecord>> {
  return { data: [], total: params.current }
}

void [
  ProCard,
  ProConfigProvider,
  ProDescriptions,
  ProField,
  ProForm,
  ProList,
  ProSelect,
  ProTable,
  columns,
  descriptionColumns,
  requestUsers,
  table,
  list,
  descriptions,
  select,
  form
]

export type {
  DescriptionsDataResult,
  DescriptionsRequestPhaseResult,
  FormDirtyResult,
  FormInstanceContract,
  FormValuesResult,
  ListDataResult,
  ListRequestPhaseResult,
  SelectOptionsResult,
  SelectRequestPhaseResult,
  TableDataResult,
  TableServerStateResult
}
