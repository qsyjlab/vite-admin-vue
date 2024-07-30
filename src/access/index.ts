import { usePermissionStore, useUserStore } from '@/store'

export function hasAuthorize(auth: string) {
  const { hasPermission } = usePermissionStore()
  return hasPermission(auth)
}

export function hasRole(role: string) {
  const { hasRole } = useUserStore()

  return hasRole(role)
}
