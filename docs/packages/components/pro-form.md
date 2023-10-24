# ProForm 高级表单

## 基本使用

:::demo
pro-form/basic
:::

## Props

| 属性         | 说明                                                       | 类型                                       | 默认值 |
| ------------ | ---------------------------------------------------------- | ------------------------------------------ | ------ |
| fields       | Schema Json                                                | FormSchema[]                               | []     |
| model        | 表单值                                                     | `Record<string, any>`                      | {}     |
| enableEffect | 是否开启 effect 事件，开启后表单值变化将触发 `@effect`事件 | `(values: Record<string, any>)=> boolean ` |        |

## fields 配置

| 属性   | 说明                            | 类型                  | 可选值 | 默认值 |
| ------ | ------------------------------- | --------------------- | ------ | ------ |
| label  | 标题                            | `string `             |        |        |
| el     | 组件名称 ， 组件实例，html 标签 | `Component \|string ` |        |        |
| key    | 唯一 key 值                     | string                |        |        |
| attrs  | v-bind                          | `Record<string, any>` |        | text   |
| events | v-on                            | `Record<string, any>` |        |        |
| col    | 栅格布局                        |                       |        |        |

### Type FormSchema

```ts
export interface FormSchema {
  label?: string
  el?: Component | string
  key: string
  attrs?: Record<string, any>
  events?: Record<string, any>
  rules?: FormItemRule[]
  col?: Partial<ColProps>
}
```
