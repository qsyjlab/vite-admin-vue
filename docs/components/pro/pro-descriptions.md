# ProDescriptions 高级描述列表

`ProDescriptions<TRecord, TParams>` 用于展示详情数据。组件复用 `ProField` 的只读渲染能力，支持泛型数据路径、异步请求、响应式布局、分组、折叠、复制以及命令式 Ref API。

## 基本使用

`key` 只负责 Vue 渲染和插槽的稳定标识，不承担取值职责。需要展示数据的列必须显式声明 `dataIndex`。

```vue
<template>
  <pro-descriptions
    ref="descriptionsRef"
    v-model:data="detail"
    :columns="columns"
    :request="getUserDetail"
    :params="{ id: userId }"
    :column="{ xs: 1, sm: 2, lg: 3 }"
    :collapsed-rows="{ xs: 3, sm: 2 }"
    :group-titles="{ base: '基本信息', audit: '审计信息' }"
    title="用户详情"
    collapsible
  >
    <template #extra="{ reload }">
      <el-button link type="primary" @click="reload()">刷新</el-button>
    </template>

    <template #status="{ value }">
      <el-tag :type="value === 'enabled' ? 'success' : 'info'">
        {{ value === 'enabled' ? '启用' : '停用' }}
      </el-tag>
    </template>
  </pro-descriptions>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import {
  useProDescriptions,
  type ProDescriptionColumns,
  type ProDescriptionsInstance
} from '@framebase/element-plus-pro-components'

interface UserDetail {
  id: string
  profile: {
    name: string
  }
  status: 'enabled' | 'disabled'
  createdAt: string
}

interface UserDetailParams {
  id: string
}

const userId = ref('user-001')
const detail = ref<UserDetail>()
const columns: ProDescriptionColumns<UserDetail> = [
  {
    key: 'id',
    dataIndex: 'id',
    label: '用户编号',
    group: 'base',
    copyable: true
  },
  {
    key: 'name',
    dataIndex: 'profile.name',
    label: '姓名',
    group: 'base'
  },
  {
    key: 'status',
    dataIndex: 'status',
    label: '状态',
    group: 'base'
  },
  {
    key: 'createdAt',
    dataIndex: ['createdAt'],
    label: '创建时间',
    group: 'audit',
    valueType: 'dateTime',
    span: { xs: 1, lg: 2 }
  }
]

async function getUserDetail(params: UserDetailParams): Promise<UserDetail> {
  return fetchUserDetail(params.id)
}

const descriptionsRef =
  useTemplateRef<ProDescriptionsInstance<UserDetail, UserDetailParams>>('descriptionsRef')
const descriptions = useProDescriptions(descriptionsRef)

async function reloadCurrentUser() {
  await descriptions.reload({ id: userId.value })
}
</script>
```

## 泛型与数据模型

```ts
interface ProDescriptionsProps<
  TRecord extends object,
  TParams extends object = Record<string, never>
> {
  data?: TRecord
  columns?: ProDescriptionColumns<TRecord>
  request?: (params: TParams, context: ProRequestContext) => Promise<TRecord>
  params?: TParams
  // ...
}
```

- `TRecord` 贯穿 `data`、`columns`、渲染作用域、Ref 返回值和请求结果。
- `TParams` 贯穿 `params`、`request`、`reload(params)` 和 `useProDescriptions`。
- `dataIndex` 支持点路径与数组路径，并提供基于 `TRecord` 的类型提示。
- `key` 是必填稳定标识，同时用于具名插槽；组件不会用 `key` 回退读取数据。

## Props

除下列属性外，其余属性会透传给内部的 `el-descriptions`。

| 属性               | 说明                                       | 类型                                     | 默认值                    |
| ------------------ | ------------------------------------------ | ---------------------------------------- | ------------------------- |
| `data`             | 受控详情数据，支持 `v-model:data`          | `TRecord`                                | -                         |
| `columns`          | 描述项配置                                 | `ProDescriptionColumns<TRecord>`         | `[]`                      |
| `request`          | 详情请求函数                               | `(params, context) => Promise<TRecord>`  | -                         |
| `params`           | 请求参数；变化时可触发重新请求             | `TParams`                                | `{}`                      |
| `autoRequest`      | `request` 或 `params` 变化时是否自动请求   | `boolean`                                | `true`                    |
| `loading`          | 外部受控加载状态；传入后优先于内部请求状态 | `boolean`                                | -                         |
| `title`            | 标题                                       | `string`                                 | -                         |
| `border`           | 是否显示边框                               | `boolean`                                | `true`                    |
| `column`           | 每行列数，支持响应式配置                   | `number \| ResponsiveNumber`             | `{ xs: 1, sm: 2, md: 3 }` |
| `direction`        | 描述排列方向                               | `'horizontal' \| 'vertical'`             | `'horizontal'`            |
| `size`             | 尺寸                                       | `'large' \| 'default' \| 'small'`        | `'default'`               |
| `labelWidth`       | 标签宽度                                   | `string \| number`                       | -                         |
| `groupTitles`      | 分组 key 到标题的映射                      | `Record<string, string>`                 | `{}`                      |
| `collapsible`      | 是否启用折叠                               | `boolean`                                | `false`                   |
| `collapsed`        | 受控折叠状态，支持 `v-model:collapsed`     | `boolean`                                | -                         |
| `defaultCollapsed` | 非受控模式的初始折叠状态                   | `boolean`                                | `false`                   |
| `collapsedRows`    | 折叠后保留的行数，支持响应式配置           | `number \| ResponsiveNumber`             | `1`                       |
| `emptyText`        | 无数据提示                                 | `string`                                 | `'暂无详情数据'`          |
| `errorText`        | 请求错误提示或转换函数                     | `string \| ((error: unknown) => string)` | -                         |
| `retryText`        | 错误态重试按钮文案                         | `string`                                 | `'重新加载'`              |

```ts
type ResponsiveNumber = number | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>>
```

组件通过 `ResizeObserver` 读取自身容器宽度，而不是读取 window 宽度。断点为：`xs < 768`、`sm >= 768`、`md >= 992`、`lg >= 1200`、`xl >= 1920`。

## Request 与 params

- 同时提供 `request` 和 `autoRequest=true` 时，组件挂载后立即请求。
- `request`、`params` 或 `autoRequest` 变化时会重新同步请求状态；`params` 使用深度监听和安全副本。
- 连续请求只接收最后一次有效结果，组件卸载时会取消仍在进行的请求状态。
- 请求函数第二个参数包含 `{ signal, attempt }`，组件支持 `requestDebounce`、`requestRetry` 和 `requestRetryDelay`。
- 请求成功后更新内部数据并触发 `update:data`；请求失败后显示错误态，触发 `request-error`，并可通过默认按钮、`#error` 插槽或 `reload()` 重试。
- `autoRequest=false` 时可以先打开抽屉或弹窗，再调用 `reload(params)` 精确控制首个请求时机。

## Column 配置

| 属性                           | 说明                                                    |
| ------------------------------ | ------------------------------------------------------- |
| `key`                          | 必填稳定标识，用于渲染、具名插槽和配置追踪，不参与取值  |
| `dataIndex`                    | 数据读取路径，支持点路径或数组路径                      |
| `label`                        | 标签文本                                                |
| `group`                        | 分组 key；标题通过 `groupTitles` 映射，未映射时显示 key |
| `span`                         | 占用的描述列数，支持响应式配置                          |
| `hide`                         | 静态隐藏或根据当前 `data` 动态隐藏                      |
| `tooltip`                      | 标签旁的说明提示                                        |
| `copyable`                     | 是否允许复制，或传入复制配置                            |
| `valueType` / `valueEnum`      | `ProField` 只读渲染配置                                 |
| `options` / `optionFields`     | 选项数据及字段映射，透传给 `ProField`                   |
| `fieldProps`                   | 透传给 `ProField` 的字段属性                            |
| `emptyText` / `formatter`      | 空值和格式化配置                                        |
| `renderLabel` / `render`       | 标签和值的函数式渲染器                                  |
| `width` / `minWidth`           | 描述项宽度配置                                          |
| `align` / `labelAlign`         | 值与标签对齐方式                                        |
| `className` / `labelClassName` | 值与标签类名                                            |

`column` 决定当前容器每行的列数，列上的 `span` 决定该项占用几列。折叠规划会同时计算响应式 `column`、每项 `span` 和 `collapsedRows`，不会简单按数组数量截断。

## 分组与折叠

- 相同 `group` 的列进入同一个 `el-descriptions` 分组，分组顺序以列首次出现的顺序为准。
- 未配置 `group` 的列进入默认无标题分组。
- `collapsed` 存在时为受控模式；否则使用 `defaultCollapsed` 管理内部状态。
- 仅当折叠后的列数少于可见列数时显示折叠入口。
- `update:collapsed` 和 `collapse` 会在状态变更时触发。

## Copy

```ts
interface ProDescriptionsCopyConfig<TRecord extends object, TValue = unknown> {
  text?: string | ((scope: ProDescriptionsRenderScope<TRecord, TValue>) => string)
  successText?: string
}
```

`copyable: true` 默认复制当前格式化前的字段值。传入配置可以自定义复制文本和成功提示；组件优先使用 Clipboard API，并提供浏览器兼容回退。

## Slots

| 插槽           | 作用域                                                      |
| -------------- | ----------------------------------------------------------- |
| `title`        | -                                                           |
| `extra`        | `{ data, reload, collapsed, toggleCollapse }`               |
| `loading`      | -                                                           |
| `empty`        | -                                                           |
| `error`        | `{ error, reload }`                                         |
| `collapse`     | `{ collapsed, toggleCollapse }`                             |
| `label`        | `{ data, value, column }`，所有标签的公共回退插槽           |
| `item`         | `{ data, value, column }`，所有值的公共回退插槽             |
| `[key]`        | 当前 `key` 对应的值插槽，作用域为 `{ data, value, column }` |
| `[key]-label`  | 当前 `key` 对应的标签插槽                                   |
| `[group]Title` | 分组标题插槽，作用域为 `{ group, data }`                    |

具名值插槽优先级高于 `item`、`render` 和 `ProField`；具名标签插槽优先级高于 `renderLabel` 和公共 `label` 插槽。

## Events

| 事件                   | 参数                   | 说明                          |
| ---------------------- | ---------------------- | ----------------------------- |
| `update:data`          | `TRecord \| undefined` | 请求或 `setData` 更新当前数据 |
| `update:collapsed`     | `boolean`              | 折叠状态更新                  |
| `collapse`             | `boolean`              | 折叠状态发生变化              |
| `loading-change`       | `boolean`              | 内部请求加载状态变化          |
| `request-state-change` | `ProRequestLifecycle`  | 请求阶段与动作发生变化        |
| `request-error`        | `unknown`              | 请求失败                      |

## Ref 与 useProDescriptions

组件使用 Vue 3.5 `useTemplateRef()` 获取泛型实例，也可以通过 `useProDescriptions(ref)` 调用同一组命令：

- `reload(params?)`：使用当前参数或新参数重新请求。
- `getData()` / `setData(data?)`：读取或替换安全副本。
- `getLoading()` / `getRequestLifecycle()` / `getError()`：读取当前状态。
- `getCollapsed()` / `setCollapsed(value)` / `toggleCollapse()`：读取和控制折叠状态。

Hook 不创建注册通道；模板 Ref 尚未挂载时，命令会明确抛出实例不可用错误。
