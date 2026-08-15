# @framebase/element-plus-theme

面向 Element Plus 2.9+ 的可选视觉主题包，提供统一的颜色、文字、圆角、阴影和常用组件样式。

## 完整使用

```ts
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@framebase/element-plus-theme/style.css'
```

`style.css` 已包含亮色令牌、暗色令牌和组件美化。暗色模式沿用 Element Plus 的 `html.dark` 标记。

## 按层使用

```ts
import '@framebase/element-plus-theme/tokens.css'
import '@framebase/element-plus-theme/dark.css'
import '@framebase/element-plus-theme/components.css'
```

业务可在主题包之后覆盖 `--framebase-*` 变量，不需要直接修改组件选择器。

## 边界

- 只包含通用 Element Plus 视觉规则。
- 不包含后台 Layout、侧边栏、顶部导航等应用专用样式。
- 不自动引入 Element Plus 组件 CSS。
