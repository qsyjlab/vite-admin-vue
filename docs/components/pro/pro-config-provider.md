# ProConfigProvider 全局配置

`ProConfigProvider` 为 Pro 系列组件提供可嵌套的局部默认配置，并同步 Element Plus 的尺寸和命名空间上下文。组件显式传入的属性优先于 Provider。

```vue
<pro-config-provider
  size="small"
  :dark="true"
  :theme="{ variables: { '--workspace-accent': '#409eff' } }"
  :card="{ bordered: true, shadow: 'hover' }"
  :list="{ layout: 'grid', emptyText: '暂无项目' }"
>
  <project-workspace />
</pro-config-provider>
```

## Props

| 属性           | 说明                                       | 类型                                  |
| -------------- | ------------------------------------------ | ------------------------------------- |
| `size`         | Pro 组件和 Element Plus 子组件的默认尺寸   | `small \| default \| large`           |
| `namespace`    | Element Plus 局部命名空间                  | `string`                              |
| `dark`         | 为当前 Provider 子树启用暗色变量作用域     | `boolean`                             |
| `theme`        | 自定义 class 与 CSS variables              | `ProConfigProviderThemeConfig`        |
| `field`        | 空值和字段 renderer 默认配置               | `ProConfigProviderFieldConfig`        |
| `form`         | 表单尺寸、标签位置和标签宽度               | `ProConfigProviderFormConfig`         |
| `table`        | 表格响应适配、参数转换、工具栏和外观默认值 | `ProConfigProviderTableConfig`        |
| `descriptions` | 描述列表列数、边框、尺寸和空状态           | `ProConfigProviderDescriptionsConfig` |
| `card`         | 卡片边框、阴影和折叠默认值                 | `ProConfigProviderCardConfig`         |
| `list`         | 列表布局、请求适配、尺寸和空状态           | `ProConfigProviderListConfig`         |

嵌套 Provider 对每个配置分组执行浅层合并，`field.renderers` 和 `theme.variables` 会继续合并；子级只需声明需要覆盖的字段。
