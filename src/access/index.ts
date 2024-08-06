import { usePermissionStore, useUserStore } from '@/store'
import { defineAppPlugin } from '@/utils'

export function hasAuthorize(auth: string) {
  const { hasPermission } = usePermissionStore()
  return hasPermission(auth)
}

export function hasRole(role: string) {
  const { hasRole } = useUserStore()

  return hasRole(role)
}

export default defineAppPlugin(app => {
  const globalProperties = app.config.globalProperties
  globalProperties['$hasAuthorize'] = hasAuthorize
  globalProperties['$hasRole'] = hasRole
})
