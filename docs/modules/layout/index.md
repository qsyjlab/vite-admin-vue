# 布局模式

项目支持 4 种布局模式，枚举定义在 `src/layouts/basic-layout/enum.ts`：

| 模式     | 枚举值    | 说明                                                         |
| -------- | --------- | ------------------------------------------------------------ |
| 侧边栏   | `Side`    | 所有菜单在左侧垂直展示（默认）                               |
| 顶部菜单 | `Top`     | 所有菜单在顶部水平展示                                       |
| 顶部混合 | `TopMix`  | 一级菜单在顶部，`splitMenu=true` 时二级菜单在左侧            |
| 左侧混合 | `SideMix` | 一级菜单以图标列在最左侧窄列，二级菜单以展开形式在其右侧拉出 |

```ts
// src/layouts/basic-layout/enum.ts
export enum LayoutMode {
  TopMix = 'TOP_MIX',
  Top = 'TOP',
  Side = 'SIDE',
  SideMix = 'SIDEMIX'
}
```

## 切换方式

通过设置抽屉切换：点击右上角设置按钮 → 打开「系统布局配置」抽屉 → 在「导航模式」选项中选择。

切换由 `useLayoutConfigHandler` 的 `setLayoutConfig(LayoutConfigHandlerEnum.LAYOUT_MODE, value)` 处理，见 `src/hooks/layout-config/layout-config.ts`。

## 存储

布局配置存储在 layout store（`src/store/module/layout.ts` 的 `useLayoutStore`），`setLayoutConfig` 会在合并配置后调用 `setLayoutCache` 持久化到 `localStorage`，存储 key 为 `__LAYOUT__`（带 `storagePrefix` 前缀）。

```ts
// src/store/module/layout.ts
setLayoutConfig(config) {
  this.layoutConfig = { ...this.layoutConfig, ...config }
  setLayoutCache(this.layoutConfig)
}
```

## 各模式特点

### Side 侧边栏布局

最常用的中后台布局，所有菜单在左侧垂直展示，支持折叠。

- 默认模式
- 菜单垂直展示
- 支持折叠（`collapsed` / `asideMenuCollapsed`）
- 折叠后宽度为 `60px`，展开宽度为 `asideWidth`（默认 `220`）

### Top 顶部菜单布局

适合菜单层级较少的项目，所有菜单在顶部水平展示。

- 菜单水平展示在头部
- 无侧边栏，`asideWidth` 计算为 `0`
- 头部 `z-index` 提升至 `1003`

### TopMix 顶部混合菜单

一级菜单在顶部，二级菜单在左侧，需配合 `splitMenu=true`。

- 一级菜单在顶部
- `splitMenu=true` 时，当前一级菜单下的二级菜单渲染到左侧侧栏
- 侧栏是否显示受 `splitSideMenus.length` 与 `showEmptySplitMenuSidebar` 共同控制：

```ts
const showSidebar =
  !props.layoutConfig.splitMenu ||
  splitSideMenus.value.length > 0 ||
  props.layoutConfig.showEmptySplitMenuSidebar
```

- 切换到其他模式时，`useLayoutConfigHandler` 会自动把 `splitMenu` 重置为 `false`：

```ts
// src/hooks/layout-config/layout-config.ts
case LayoutConfigHandlerEnum.LAYOUT_MODE: {
  if (value !== LayoutMode.TopMix)
    return {
      splitMenu: false,
      layoutMode: value
    }
  return {
    layoutMode: value
  }
}
```

### SideMix 左侧菜单混合

一级菜单以图标列在最左侧窄列（宽度 `60px`），二级菜单以展开面板形式在其右侧拉出。

- 一级菜单为窄图标列
- 二级菜单为展开面板
- **不使用 `splitMenu`**，独立通过 `mixMenuLayoutConfig.showChildren` 与 `sideMixFixedMenu` 控制
- `sideMixFixedMenu=true` 且子菜单展开时，总宽度为 `60 + asideWidth`

```ts
// src/layouts/basic-layout/basic-layout-core.vue
[LayoutMode.SideMix]: () => {
  const computedAsideWidth = props.isMobile
    ? 0
    : sideMixFixedMenu && props.mixMenuLayoutConfig.showChildren
      ? sideMixWidth + asideWidth
      : sideMixWidth
  // ...
}
```
