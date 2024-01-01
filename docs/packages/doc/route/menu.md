# 菜单

## 菜单配置

```ts
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

  // 当前激活的菜单的 name （如果是详情页面不存在 menu 中可以指定 激活的菜单）
  currentActiveMenu?: string
  // 隐藏子菜单
  hideChildrenInMenu?: boolean
  // 角色类型
  roles?: string[] | number[]
```

## 菜单模块

顶级路由 / 开头作为一级菜单

## 如何新增菜单

按照菜单层级创建路由则会生成对应层级的菜单,因为路由扁平化的缘故则试图始终不会超过 2 层
