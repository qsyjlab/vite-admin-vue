import { useUserStore } from '@/store'

/**
 *  是否有权限验证权限
 * @param permission 权限名称
 * @returns  {Boolean}
 */
export function hasAuth(permission: string | undefined): boolean {
  const userStore = useUserStore()
  if (!permission) return false
  return userStore.permissions.includes(permission)
}

/**
 * 是否是当前角色
 * @param role
 * @returns
 */
export function hasRole(role: string): boolean {
  const userStore = useUserStore()
  return userStore.userInfo.userRole === role
}
