# ProConfigProvider 全局配置

## 基本使用

:::demo
pro-config-provider/basic
:::

## Props

| 属性     | 说明              | 类型           | 默认值 |
| -------- | ----------------- | -------------- | ------ |
| proTable | proTable 相关配置 | string \| slot |        |

### Type ProConfigProviderProps

```ts
export interface ProConfigProviderProps {
  proTable?: {
    transform?: (respose: any) => { total: number; data: any[] }
    transformParams?: (params: any) => any
  }
}
```
