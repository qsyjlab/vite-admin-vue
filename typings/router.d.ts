/// <reference types="vue-router" />

interface ExtraRouteMeta {
  // 路由标题
  title?: string
  // 是否验证权限
  isNotAuth?: boolean
  // 是否缓存
  isKeepAlive?: boolean
  // 图标
  icon?: string
  // 菜单栏隐藏
  hideInMenu?: boolean
  // 面包屑 导航隐藏
  hideInBreadcrumb?: boolean
  // 排序
  sort?: number
  // 外链
  href?: string
}

declare module 'vue-router' {
  export interface RouteMeta extends ExtraRouteMeta {
    title?: string
  }
}

export {}
