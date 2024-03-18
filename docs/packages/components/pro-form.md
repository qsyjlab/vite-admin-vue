# ProForm 高级表单

## 基本使用

:::demo
pro-form/basic
:::

## Props

其余 `el-form` 属性会被继承

| 属性         | 说明                                                       | 类型                                       | 默认值 |
| ------------ | ---------------------------------------------------------- | ------------------------------------------ | ------ |
| fields       | Schema Json                                                | FormSchema[]                               | []     |
| model        | 表单值                                                     | `Record<string, any>`                      | {}     |
| enableEffect | 是否开启 effect 事件，开启后表单值变化将触发 `@effect`事件 | `(values: Record<string, any>)=> boolean ` |        |

## fields 配置

| 属性            | 说明                            | 类型                  | 可选值                                                 | 默认值 |
| --------------- | ------------------------------- | --------------------- | ------------------------------------------------------ | ------ |
| label           | 标题                            | `string `             |                                                        |        |
| el              | 组件名称 ， 组件实例，html 标签 | `Component \|string ` |                                                        |        |
| key             | 唯一 key 值                     | string                |                                                        |        |
| attrs           | v-bind                          | `Record<string, any>` |                                                        | text   |
| events          | v-on                            | `Record<string, any>` |                                                        |        |
| col             | 栅格布局                        |                       |                                                        |        |
| tip             | tooltip 提示                    | `string`              |                                                        |        |
| required        | 是否必填                        | `boolean`             |                                                        |        |
| requiredMessage | 必填验证提示                    | `boolean`             |                                                        |        |
| show            | 是否显示                        | `boolean \|((value: any, values: Record<string, any>) => boolean)` |  |False|

### Type FormSchema

```ts
export interface FormSchema extends Partial<Pick<FormItemProps, 'labelWidth' | 'size'>> {
  /** 标题 */
  label?: string
  /** 组件或者全局组件 */
  el?: Component | string
  /** 唯一字段 */
  key: string
  /** tooltip 提示 */
  tip?: string
  /** 是否充满 content */
  fill?: boolean
  /** 是否必填 */
  required?: boolean
  // 验证失败信息
  requiredMessage?: string
  /**
   * 是否显示在表单上
   * @default true
   */
  show?: boolean | ((value: any, values: Record<string, any>) => boolean)
  /** 组件属性 */
  attrs?: Record<string, any>
  /** 组件事件 */
  events?: Record<string, any>
  /** 组件验证规则 */
  rules?: FormItemRule[]
  /** grid 布局 属性 */
  col?: Partial<ColProps>
}
```

## Expose

| 属性             | 说明                      | 类型                                                     | 可选值 | 默认值 |
| ---------------- | ------------------------- | -------------------------------------------------------- | ------ | ------ |
| validate         | 验证表单                  | `(handle: (model: Record<string, any>) => void) => void` |        |        |
| resetFields      | 重置表单                  | `() => void`                                             |        |        |
| clearValidate    | 清除验证                  | 同 `el-form`                                             |        |        |
| forceUpdateModel | 强制合并数据到 form model | (model: Record<string, any>) => void                     |        |        |
|                  |                           |                                                          |        |        |
|                  |                           |                                                          |        |        |
