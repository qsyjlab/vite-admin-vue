/*
 * @Description: 鉴权
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 15:32:26
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 15:52:27
 * @FilePath: \vite-admin-vue\src\utils\router\auth.ts
 */
import store from '@/store'

/**
 *  是否有权限验证权限
 * @param permission 权限名称
 * @returns  {Boolean}
 */
export function hasAuth(permission: string | undefined): boolean {
  if (!permission) return false
  return store.state.user.permissions.includes(permission)
}

/**
 * 是否是当前角色
 * @param role
 * @returns
 */
export function hasRole(role: string): boolean {
  return store.state.user.userInfo.userRole === role
}
