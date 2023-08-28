# 路由配置

## 模块

`src/rotuer/routes/modules` 下任意一个文件都作为一个 路由模块

```ts
import { defineExposeRoutes } from "@/router";
// import { createBlankContainer } from '@/layouts'
import { Layout } from "@/router/constant";

export default defineExposeRoutes([
  {
    name: "Charts",
    path: "/charts",
    meta: {
      title: "图表",
      sort: 4,
      icon: "ep.document",
    },

    redirect: { name: "Echarts" },
    component: Layout,
    children: [
      {
        name: "Echarts",
        path: "/echarts",
        meta: {
          title: "echarts",
          sort: 4,
        },
        component: () => import("@/views/system/charts/echarts/echarts.vue"),
      },
    ],
  },
]);
```

## 多级路由

::: warning 注意事项

- 项目路由 name 不可重复
- 所有路由最终都会转变成 二级路由，无法 继续嵌套子集路由，子集路由将只作为菜单生成
  :::

```ts
// 源数据
export default defineExposeRoutes([
  {
    name: "Feature",
    path: "/feature",
    meta: {
      title: "功能",
      icon: "ify.iconoir:git-fork",
    },
    redirect: "/feature/watermark2",
    component: Layout,
    children: [
      {
        name: "TabPage",
        path: "tab-page",
        meta: {
          title: "标签栏",
        },
        component: () => import("@/views/system/feature/tab-page/tab-page.vue"),
        children: [
          {
            name: "TabPageDetail",
            path: "detail/:id",
            meta: {
              title: "标签栏详情",
              hideInMenu: true,
            },
            component: () =>
              import("@/views/system/feature/tab-page/detail.vue"),
          },
        ],
      },
    ],
  },
]);
```

```ts
// 最终生成
export default defineExposeRoutes([
  {
    name: "Feature",
    path: "/feature",
    meta: {
      title: "功能",
      icon: "ify.iconoir:git-fork",
    },
    redirect: "/feature/watermark2",
    component: Layout,
    children: [
      {
        name: "TabPage",
        path: "tab-page",
        meta: {
          title: "标签栏",
        },
        component: () => import("@/views/system/feature/tab-page/tab-page.vue"),
      },
      {
        name: "TabPageDetail",
        path: "tab-page/detail/:id",
        meta: {
          title: "标签栏详情",
          hideInMenu: true,
        },
        component: () => import("@/views/system/feature/tab-page/detail.vue"),
      },
    ],
  },
]);
```

## Route Meta 配置

详见根目录 `/typings/router.d.ts`

## 外部页面嵌套

### 外链

```ts
 {
    name: 'OutLink',
    path: 'out-link',
    meta: {
        title: '外链',
        href: 'https://qsyjlab.club'
    },
    component: BlankContainer
},
```


### iframe 


``` ts
{
    name: 'Iframe',
    path: 'iframe',
    meta: {
        title: 'iframe'
    },
    component: () => import('@/views/system/out/iframe/iframe.vue')
}
```

