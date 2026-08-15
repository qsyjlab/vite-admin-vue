import { defineStore } from 'pinia'
import { setTokenCahce, setUserInfoCache, setRolesCache, clearUserCache } from '../local'
import { login as loginHttp } from '@/api/user'
import { usePermissionStore } from './permissions'
import { piniaInstance } from '../pinia'

export const userStoreKey = 'userStoreKey'

interface UserStoreState {
  initialized: boolean
  userInfo: {
    userId: number | string
    userName: string
  }
  token: string | null | undefined
  permissions: string[]
  roles: string[] | number[]
}

type UserStoreGetter = Record<string, any>

type UserStoreActions = {
  setInitialized: (val: boolean) => void
  setUserInfo: (userInfo: UserStoreState['userInfo']) => void
  setToken: (token: string) => void
  loginSystem: (data: { username: string; password: string }) => ReturnType<typeof loginHttp>
  loginOutSystem: NOOP
  setRoles: (roles: string[] | number[]) => void
  hasRole: (role: number | string | number[] | string[]) => boolean
  loginAfterInitialize: (data: Recordable<any>) => Promise<void>
}

export const useUserStore = defineStore<string, UserStoreState, UserStoreGetter, UserStoreActions>(
  userStoreKey,
  {
    state() {
      return {
        initialized: false,
        userInfo: {
          userId: '',
          userName: ''
        },
        token: '',
        // 权限
        permissions: [],
        // 角色类型
        roles: []
      }
    },
    actions: {
      setInitialized(val) {
        this.initialized = val
      },
      setUserInfo(userInfo: UserStoreState['userInfo']) {
        this.userInfo = userInfo
        setUserInfoCache(this.userInfo)
      },
      setRoles(roles) {
        this.roles = roles
        setRolesCache(roles.map(String))
      },

      hasRole(auth) {
        if (!auth) return false
        if (Array.isArray(auth))
          return auth.map(String).some(r => this.roles.map(String).includes(String(r)))
        return this.roles.map(String).includes(String(auth))
      },

      setToken(token) {
        if (token) {
          this.token = token
          setTokenCahce(token)
        }
      },
      async loginAfterInitialize(data) {
        this.setInitialized(false)

        this.setToken(data.token)
        this.setUserInfo({
          userId: data.userId,
          userName: data.username
        })

        // 从登录响应中提取角色值（roles 可能为 { value }[] 或 string[]）
        const roleValues = Array.isArray(data.roles)
          ? data.roles.map((r: any) => (typeof r === 'object' ? r.value : r))
          : []
        this.setRoles(roleValues)

        const permission = usePermissionStore()
        permission.setPermissions(data.permissions || [])
        await permission.loadDynamicRoutes()
        this.setInitialized(true)
      },
      async loginSystem(data) {
        const res = await loginHttp(data)
        if (res.data) {
          await this.loginAfterInitialize(res.data)
        }
        return res
      },

      // 退出登录
      loginOutSystem() {
        const permissionStore = usePermissionStore()
        // 仅清除用户/权限缓存，保留布局配置（暗黑模式、侧边栏宽度等）与权限模式
        clearUserCache()
        permissionStore.resetPermissionRoutes()
        this.setInitialized(false)
        this.token = ''
        this.userInfo = { userId: '', userName: '' }
        this.permissions = []
        this.roles = []
      }
    }
  }
)

/**
 * @see https://pinia.vuejs.org/zh/ssr/
 * @see https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html
 */
export function useUserStoreOut() {
  return useUserStore(piniaInstance)
}

export default useUserStore
