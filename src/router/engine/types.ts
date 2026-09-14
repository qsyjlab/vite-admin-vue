import type { RouteRecordRaw } from 'vue-router'
import type { PermissionModeEnum } from '@/enum'

export interface SystemRouteEngineContext {
  permissionMode: keyof typeof PermissionModeEnum
  permissions: string[]
  roles: Array<string | number>
  backendRoutes?: RouteRecordRaw[]
}
