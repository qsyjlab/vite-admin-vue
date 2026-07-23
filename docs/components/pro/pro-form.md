# ProForm 高级表单

`ProForm<TModel>` 基于 Element Plus Form，提供泛型字段配置、动态联动、值转换、响应式栅格折叠、提交器插槽和 Ref 命令能力。

## 基本使用

:::demo
pro-form/basic
:::

## Props

除下列属性外，其余 `el-form` 属性会继续透传。

| 属性               | 说明                                     | 类型                                                | 默认值               |
| ------------------ | ---------------------------------------- | --------------------------------------------------- | -------------------- |
| `fields`           | 表单字段配置                             | `FormSchema<TModel>[]`                              | `[]`                 |
| `model`            | 表单初始值；组件内部使用安全副本         | `TModel`                                            | `{}`                 |
| `layout`           | 是否使用 24 栅格布局                     | `boolean`                                           | `true`               |
| `submitter`        | 内置提交器配置；`false` 时关闭           | `false \| ProFormSubmitterConfig`                   | `inline=true` 时启用 |
| `collapsible`      | 是否允许表单收起                         | `boolean`                                           | `true`               |
| `collapsed`        | 受控收起状态，支持 `v-model:collapsed`   | `boolean`                                           | -                    |
| `defaultCollapsed` | 非受控模式的初始收起状态                 | `boolean`                                           | `false`              |
| `collapsedRows`    | 收起后的目标栅格行数，可按断点配置       | `number \| Partial<Record<FormBreakpoint, number>>` | `{ xs: 2, sm: 1 }`   |
| `expandOnInvalid`  | 校验失败时自动展开折叠字段               | `boolean`                                           | `true`               |
| `enableEffect`     | 值变化时触发 `effect` 事件               | `boolean`                                           | `false`              |
| `request`          | 异步加载初始值，接收 `AbortSignal`       | `(context) => Promise<Partial<TModel>>`             | -                    |
| `autoRequest`      | 挂载后自动执行异步初始化                 | `boolean`                                           | `true`               |
| `onFinish`         | 基础表单提交处理器，提交期间防止重复调用 | `(values) => unknown \| Promise<unknown>`           | -                    |
| `loading`          | 受控加载状态，支持 `v-model:loading`     | `boolean`                                           | `false`              |
| `dirty`            | 表单脏状态，支持 `v-model:dirty`         | `boolean`                                           | `false`              |

`collapsedRows` 与 Element Plus 使用相同断点：`xs < 768`、`sm ≥ 768`、`md ≥ 992`、`lg ≥ 1200`、`xl ≥ 1920`。规划器会同时计算字段 `span`、`offset` 和提交器栅格宽度。

## 字段配置

| 属性                          | 说明                                                   |
| ----------------------------- | ------------------------------------------------------ |
| `key`                         | 列表渲染的稳定标识，不参与字段取值                     |
| `name`                        | 表单字段路径，支持点路径和数组路径；未设置时使用 `key` |
| `label`                       | 字段标题                                               |
| `valueType`                   | 使用 `ProField` 渲染的字段类型                         |
| `el`                          | 自定义组件名或组件实例                                 |
| `attrs` / `events`            | 静态组件属性和事件                                     |
| `fieldProps`                  | 动态组件属性，支持字段依赖上下文                       |
| `dependencies`                | 当前字段依赖的模型路径                                 |
| `shouldUpdate`                | 高级模型更新判定                                       |
| `show` / `disabled` / `rules` | 静态值或动态解析函数                                   |
| `normalize`                   | 输入写入模型前转换                                     |
| `transform`                   | 生成提交值时转换，不修改编辑模型                       |
| `col`                         | Element Plus `ColProps`，支持响应式断点                |

仅因表单收起而隐藏的字段会保持挂载，输入状态、远程选项和校验注册不会丢失；`show=false` 的字段才会卸载并退出校验。

## Submitter

`submitter` 支持：

- `submitText`、`resetText`
- `showSubmit`、`showReset`
- `submitButtonProps`、`resetButtonProps`
- `col`：操作区栅格配置
- `align`：`start | center | end`

也可以使用 `#submitter` 完全自定义：

```vue
<template #submitter="{ submit, reset, collapsed, canCollapse, toggleCollapse }">
  <!-- 自定义操作区 -->
</template>
```

## Ref 与 useProForm

组件通过 Vue 3.5 `useTemplateRef()` 和 `useProForm(ref)` 提供以下命令，不再使用 `@register`：

- `submit()`、`reset()`
- `validate()`、`validateField()`、`resetFields()`、`clearValidate()`
- `setFieldValue()`、`getFieldValue()`、`getFieldsValue()`
- `setFieldErrors()`、`clearFieldErrors()`
- `setCollapsed()`、`toggleCollapse()`、`getCollapsed()`
- `forceUpdateModel()`
- `load()`、`getLoading()`、`getSubmitting()`
- `isDirty()`、`markClean()`

`submit` 事件得到的是执行字段 `transform` 后的安全副本；命令式合并字段值始终以未转换的编辑模型为基础。

页面级编辑场景可以调用 `useProFormDirtyGuard(formRef)`，统一处理路由离开与浏览器刷新前的未保存提示。异步初始化和成功提交会自动建立新的 clean baseline。
