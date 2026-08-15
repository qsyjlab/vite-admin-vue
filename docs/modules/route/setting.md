# 路由配置

## 模块

`src/router/routes/modules` 下任意一个文件都作为一个路由模块。使用 `defineExposeRoutes` 导出路由数组，菜单排序通过 `meta.order` 控制（数值越小越靠前）。

```ts
import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'Charts',
    path: '/charts',
    meta: {
      title: '图表',
      order: 20,
      icon: 'ep.trend-charts'
    },
    redirect: { name: 'Echarts' },
    component: Layout,
    children: [
      {
        name: 'Echarts',
        path: 'echarts',
        meta: {
          title: 'ECharts',
          icon: 'ep.data-line',
          order: 10
        },
        component: () => import('@/views/system/charts/echarts/echarts.vue')
      }
    ]
  }
])
```

::: tip 排序字段
项目使用 `meta.order` 进行菜单排序，不是 `sort`。
:::

## 多级路由

::: warning 注意事项

- 项目路由 `name` 不可重复
- 所有路由最终都会扁平化为二级路由，无法继续嵌套子集路由，子集路由将只作为菜单生成
  :::

源数据（`TabPage` 下还有子路由 `TabPageDetail`）：

```ts
export default defineExposeRoutes([
  {
    name: 'Feature',
    path: '/feature',
    meta: {
      title: '功能',
      icon: 'svg.git-fork',
      order: 40
    },
    redirect: '/feature/watermark',
    component: Layout,
    children: [
      {
        name: 'TabPage',
        path: 'tab-page',
        meta: {
          title: '标签栏',
          icon: 'ep.collection-tag',
          order: 30
        },
        component: () => import('@/views/system/feature/tab-page/tab-page.vue'),
        children: [
          {
            name: 'TabPageDetail',
            path: 'detail/:id',
            meta: {
              title: '标签栏详情',
              icon: 'ep.tickets',
              hideInMenu: true
            },
            component: () => import('@/views/system/feature/tab-page/detail.vue')
          }
        ]
      }
    ]
  }
])
```

最终生成（子路由被提升到与 `TabPage` 同级，路径自动拼接）：

```ts
export default defineExposeRoutes([
  {
    name: 'Feature',
    path: '/feature',
    meta: {
      title: '功能',
      icon: 'svg.git-fork',
      order: 40
    },
    redirect: '/feature/watermark',
    component: Layout,
    children: [
      {
        name: 'TabPage',
        path: 'tab-page',
        meta: {
          title: '标签栏',
          icon: 'ep.collection-tag',
          order: 30
        },
        component: () => import('@/views/system/feature/tab-page/tab-page.vue')
      },
      {
        name: 'TabPageDetail',
        path: 'tab-page/detail/:id',
        meta: {
          title: '标签栏详情',
          icon: 'ep.tickets',
          hideInMenu: true
        },
        component: () => import('@/views/system/feature/tab-page/detail.vue')
      }
    ]
  }
])
```

## Route Meta 配置

详见根目录 `/typings/router.d.ts`。

## 外部页面嵌套

### 外链

外链通过 `meta.href` 指定跳转地址，`component` 使用 `BlankContainer`（从 `@/router/constant` 导入）：

```ts
import { defineExposeRoutes } from '@/router'
import { Layout, BlankContainer } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'OutLink',
    path: 'out-link',
    meta: {
      title: '外链',
      href: 'https://qsyjlab.club'
    },
    component: BlankContainer
  }
])
```

### iframe

```ts
{
  name: 'Iframe',
  path: 'iframe',
  meta: {
    title: 'iframe'
  },
  component: () => import('@/views/system/out/iframe/iframe.vue')
}
```
