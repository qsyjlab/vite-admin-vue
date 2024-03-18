import { usePermissionStore, useUserStore } from '@/store'

export function useAuth() {
  const { hasPermission } = usePermissionStore()

  const { hasRole } = useUserStore()

  return {
    hasRole,
    hasAuth: hasPermission
  }
}
