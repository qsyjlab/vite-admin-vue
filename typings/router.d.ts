/// <reference types="vue-router" />

interface ExtraRouteMeta {
  // 排序
  order?: number
  // 路由标题
  title?: string

  // 是否忽略权限
  ignoreAuth?: boolean
  // 是否忽略 keepAlive 不传默认忽略
  ignoreKeepAlive?: boolean

  // 图标字符串
  icon?: string
  // 外链
  href?: string
  // 菜单栏隐藏
  hideInMenu?: boolean
  // 面包屑 导航隐藏
  hideInBreadcrumb?: boolean
  // tab 栏标签隐藏
  hideInTab?: boolean
  // 隐藏子菜单
  hideChildrenInMenu?: boolean
}

declare module 'vue-router' {
  export interface RouteMeta extends ExtraRouteMeta {
    title?: string
  }
}

export {}
