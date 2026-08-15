/**
 * Mock 路由模块类型定义
 *
 * 注意：路由 mock 数据已迁移至 ./auth.ts 的 adminBackendMenus / editorBackendMenus / viewerBackendMenus，
 * 由 getBackendMenusByUsername 按用户名返回。此处仅保留 RouteModule 类型供 api/permission.ts 使用。
 */

export interface RouteModule {
  name?: string
  path?: string
  meta?: {
    title?: string
    sort?: number
    // icon: 'icon-document'
  }
  redirect: string
  children?: RouteModule[]
}
