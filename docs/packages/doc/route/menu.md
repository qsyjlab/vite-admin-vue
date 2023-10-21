# 菜单

## 菜单模块

顶级路由 / 开头作为一级菜单

## 如何新增菜单

按照菜单层级创建路由则会生成对应层级的菜单,因为路由扁平化的缘故则试图始终不会超过 2 层

## 隐藏不必要的路由菜单

`hideInMenu:true`

## 解决菜单中有隐藏路由不高亮问题

`currentActiveMenu:活动菜单的name`

## 当子集菜单只有一个时

`hideChildrenInMenu:true`
会隐藏子集菜单，这时需要使用 `redirect`
