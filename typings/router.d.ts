/// <reference types="vue-router" />

interface ExtraRouteMeta {
  menu?: {
    title?: string
    icon?: string
    order?: number
    hidden?: boolean
    hideChildrenInMenu?: boolean
    promoteSingleChild?: boolean
    keepParent?: boolean
  }
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
  // 固定在标签栏的路由
  affixTab?: boolean

  // 当前激活的菜单 （如果是详情页面不存在 menu 中可以指定 激活的菜单）
  currentActiveMenu?: string
  // 隐藏子菜单
  hideChildrenInMenu?: boolean
  // 角色类型
  roles?: string[] | number[]
  // 页面级缓存声明（与 ignoreKeepAlive 相对，路由模块中使用）
  isKeepAlive?: boolean
  // 由动态路由转换写入：一级业务路由已被 Layout 包装
  single?: boolean
  // 由动态路由转换写入：包装后的父级不参与 affix tab
  affix?: boolean
}

declare module 'vue-router' {
  export interface RouteMeta extends ExtraRouteMeta {
    title?: string
  }
}

export {}
