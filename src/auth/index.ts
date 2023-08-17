import { useUserStore } from '@/store'
import { usePermissionStore } from '@/store/module/permissions'

/**
 *  是否有权限验证权限
 * @param permission 权限名称
 * @returns  {Boolean}
 */
export function hasAuth(permission?: string) {
  if (!permission) return false
  const { hasPermission } = usePermissionStore()
  return hasPermission(permission)
}

/**
 * 是否是当前角色
 * @param role
 * @returns
 */
export function hasRole(role: string) {
  const userStore = useUserStore()
  // return userStore.userInfo.userRole === role
}
