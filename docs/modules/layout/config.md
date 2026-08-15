# 布局配置

布局配置项定义在 `src/config/project-setting.ts` 的 `defaultLayoutSetting`，作为项目默认值。运行时可通过设置抽屉修改并持久化。

## 配置项总览

```ts
// src/config/project-setting.ts
const setting = readonly<ProjectConfig>({
  themeColor: '#1677FF',
  theme: 'light',
  logo: '/logo.svg',

  defaultLayoutSetting: {
    layoutMode: LayoutMode.Side,

    // 头部相关
    showHeader: true,
    showBreadCrumb: true,
    showBreadCrumbIcon: true,
    showSettingButton: true,
    headerHeight: 44,
    headerTheme: 'light',

    // 侧边栏相关
    asideMenuCollapsed: false,
    asideWidth: 220,
    sideMixFixedMenu: false,
    sidebarTheme: 'light',
    darkMenuBackground: '#001529',

    // 标签栏相关
    showTagPage: true,
    tabBarHeight: 35,

    // 菜单分割
    splitMenu: false,
    showEmptySplitMenuSidebar: false,

    // 其他
    showBackTop: true,
    showFooter: true,
    footerHeight: 50
  },

  keepAliveCachePolicy: 'normal',
  permissionMode: PermissionModeEnum.ROUTE_MAPPING
})
```

## 配置项说明

### 布局模式

| 字段         | 类型         | 默认值 | 说明                              |
| ------------ | ------------ | ------ | --------------------------------- |
| `layoutMode` | `LayoutMode` | `Side` | 布局模式，详见[布局模式](./index) |

### 头部相关

| 字段                 | 类型                | 默认值    | 说明                   |
| -------------------- | ------------------- | --------- | ---------------------- |
| `showHeader`         | `boolean`           | `true`    | 是否显示头部           |
| `showBreadCrumb`     | `boolean`           | `true`    | 是否显示面包屑导航     |
| `showBreadCrumbIcon` | `boolean`           | `true`    | 是否显示面包屑导航图标 |
| `showSettingButton`  | `boolean`           | `true`    | 是否显示设置按钮       |
| `headerHeight`       | `number`            | `44`      | 头部高度               |
| `headerTheme`        | `'light' \| 'dark'` | `'light'` | 头部主题               |

### 侧边栏相关

| 字段                 | 类型                | 默认值      | 说明                                             |
| -------------------- | ------------------- | ----------- | ------------------------------------------------ |
| `asideMenuCollapsed` | `boolean`           | `false`     | 菜单是否折叠                                     |
| `asideWidth`         | `number`            | `220`       | 侧边栏宽度                                       |
| `sideMixFixedMenu`   | `boolean`           | `false`     | 混合菜单固定（SideMix 模式下子菜单展开面板固定） |
| `sidebarTheme`       | `'light' \| 'dark'` | `'light'`   | 侧边栏主题                                       |
| `darkMenuBackground` | `string`            | `'#001529'` | 深色导航背景色                                   |

### 标签栏相关

| 字段           | 类型      | 默认值 | 说明           |
| -------------- | --------- | ------ | -------------- |
| `showTagPage`  | `boolean` | `true` | 是否显示标签栏 |
| `tabBarHeight` | `number`  | `35`   | 标签栏高度     |

### 菜单分割

| 字段                        | 类型      | 默认值  | 说明                                 |
| --------------------------- | --------- | ------- | ------------------------------------ |
| `splitMenu`                 | `boolean` | `false` | 是否分割菜单，**仅 TopMix 模式生效** |
| `showEmptySplitMenuSidebar` | `boolean` | `false` | 分割菜单无子菜单时仍显示侧栏         |

### 其他

| 字段           | 类型      | 默认值 | 说明             |
| -------------- | --------- | ------ | ---------------- |
| `showBackTop`  | `boolean` | `true` | 是否显示返回顶部 |
| `showFooter`   | `boolean` | `true` | 是否显示页脚     |
| `footerHeight` | `number`  | `50`   | 页脚高度         |

## 缓存策略

`keepAliveCachePolicy` 控制组件缓存策略（位于 `ProjectConfig` 顶层，不在 `defaultLayoutSetting` 内）：

| 值       | 说明                               |
| -------- | ---------------------------------- |
| `never`  | 不缓存                             |
| `tab`    | 缓存当前 tab 中的项，且未忽略的项  |
| `normal` | 正常缓存含有 `name` 的组件（默认） |

## 主题相关

| 字段         | 类型                | 默认值        | 说明      |
| ------------ | ------------------- | ------------- | --------- |
| `theme`      | `'light' \| 'dark'` | `'light'`     | 应用主题  |
| `themeColor` | `string`            | `'#1677FF'`   | 主题色    |
| `logo`       | `string`            | `'/logo.svg'` | Logo 路径 |

## 运行时修改

运行时通过 `useLayoutConfigHandler` hook 修改布局配置，定义在 `src/hooks/layout-config/layout-config.ts`。

```ts
import {
  useLayoutConfigHandler,
  LayoutConfigHandlerEnum
} from '@/hooks/layout-config/layout-config'

const { setLayoutConfig, resetLayoutConfig, getProjectSetting } = useLayoutConfigHandler()

// 修改单个配置
setLayoutConfig(LayoutConfigHandlerEnum.LAYOUT_MODE, LayoutMode.TopMix)
setLayoutConfig(LayoutConfigHandlerEnum.COLLAPSED, true)
setLayoutConfig(LayoutConfigHandlerEnum.MENU_WIDTH, 256)
setLayoutConfig(LayoutConfigHandlerEnum.THEME_COLOR, '#1677FF')

// 重置为默认配置
resetLayoutConfig()
```

`LayoutConfigHandlerEnum` 枚举了所有可修改的配置项 key：

```ts
// src/hooks/layout-config/layout-config.ts
export const LayoutConfigHandlerEnum = {
  LAYOUT_MODE: 'layoutMode',
  COLLAPSED: 'collapsed',
  MENU_WIDTH: 'asideWidth',
  LAYOUT_THEME: 'theme',
  HEADER_HEIGHT: 'headerHeight',
  THEME_COLOR: 'themeColor',
  SIDEBAR_THEME: 'sidebarTheme',
  HEADER_THEME: 'headerTheme',
  DARK_MENU_BACKGROUND: 'darkMenuBackground',
  SHOW_TAB_PAGE: 'showTagPage',
  SHOW_FOOTER: 'showFooter',
  SHOW_BREAD_CRUMB: 'showBreadCrumb',
  TAB_BAR_HEIGHT: 'tabBarHeight',
  SPLIT_MENU: 'splitMenu',
  SHOW_EMPTY_SPLIT_MENU_SIDEBAR: 'showEmptySplitMenuSidebar'
} as const
```

### 持久化

`setLayoutConfig` 内部会调用 `layoutStore.setLayoutConfig`，后者在合并配置后调用 `setLayoutCache` 持久化到 `localStorage`，下次进入应用时自动恢复：

```ts
// src/store/module/layout.ts
setLayoutConfig(config) {
  this.layoutConfig = { ...this.layoutConfig, ...config }
  setLayoutCache(this.layoutConfig)  // 持久化到 localStorage
}
```

设置抽屉中的所有交互（导航模式、主题色、菜单宽度、折叠、显示开关等）最终都通过 `setLayoutConfig` 落库。

### 联动逻辑

部分配置项修改时存在联动：

- **切换布局模式**：切到非 `TopMix` 模式时自动把 `splitMenu` 置为 `false`。
- **切换主题**：`theme` 为 `dark` 时同步 `useDark`（`@vueuse/core`），并应用 `themeColor` 到 CSS 变量。
- **修改主题色**：通过 `setElementCssVar` 写入 CSS 变量，随当前 `theme` 联动。
- **修改深色导航背景**：写入 `--layout-dark-menu-background` CSS 变量。
