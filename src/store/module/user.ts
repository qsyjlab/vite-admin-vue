import { resetRouter } from '@/router'

import { defineStore } from 'pinia'
import { setTokenCahce, setUserInfoCache, clearCache, setPermissionsCache } from '../local'
import { login as loginHttp } from '@/api/user'
import { usePermissionStore } from './permissions'
import { Recordable } from 'vite-plugin-mock'
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
  setPermissions: (permissions: UserStoreState['permissions']) => void
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
      setPermissions(permissions: string[]) {
        this.permissions = permissions
        setPermissionsCache(permissions)
      },
      setRoles(roles) {
        this.roles = roles
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

        const permission = usePermissionStore()
        permission.setPermissions(data.permissions)
        await permission.loadDynamicRoutes()
        this.setInitialized(true)
      },
      loginSystem(data) {
        return loginHttp(data).then(async res => {
          if (res.data) {
            this.loginAfterInitialize(res.data)
          }
          return res
        })
      },

      // 退出登录
      loginOutSystem() {
        clearCache()
        resetRouter()
        this.setInitialized(false)
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
