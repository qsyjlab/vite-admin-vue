# ProCard / ProStatisticCard

`ProCard` 用于独立内容分组，支持受控或非受控折叠、加载骨架、分割、响应式列数和局部 Provider 默认值。`ProStatisticCard` 在同一外观基础上提供指标、精度、前后缀、趋势和图表插槽。

```vue
<pro-card ref="cardRef" title="交付概览" collapsible split :columns="{ xs: 2, md: 4 }">
  <delivery-stage v-for="stage in stages" :key="stage.id" :stage="stage" />
</pro-card>

<pro-statistic-card
  title="按期交付率"
  :value="92.6"
  :precision="1"
  suffix="%"
  trend="up"
  trend-value="2.4%"
/>
```

## Ref API

| 方法                  | 说明             |
| --------------------- | ---------------- |
| `getCollapsed()`      | 读取有效折叠状态 |
| `setCollapsed(value)` | 设置折叠状态     |
| `toggleCollapse()`    | 切换折叠状态     |

父组件可使用 Vue 3.5 `useTemplateRef<ProCardInstance>()`，并按需组合 `useProCard()`。
