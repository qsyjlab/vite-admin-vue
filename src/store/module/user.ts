import router from '@/router'

import { defineStore } from 'pinia'
import { setTokenCahce, setUserInfoCache, clearCache } from '../local'
import { login as loginHttp } from '@/api/user'
import useRouteStore from './route'
import { pageError } from '@/router/routes'

export const userStoreKey = 'userStoreKey'

interface UserStoreState {
  initialized: boolean
  userInfo: {
    userId: number | string
    userName: string
  }
  token: string | null | undefined
  permissions: string[]
}

type UserStoreGetter = Record<string, any>

type UserStoreActions = {
  setInitialized: (val: boolean) => void
  setUserInfo: (userInfo: UserStoreState['userInfo']) => void
  setPermissions: (permissions: UserStoreState['permissions']) => void
  setToken: (token: string) => void
  loginSystem: (data: { username: string; password: string }) => ReturnType<typeof loginHttp>
  loginOutSystem: NOOP
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
        permissions: []
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
      },
      setToken(token) {
        if (token) {
          this.token = token
          setTokenCahce(token)
        }
      },
      loginSystem(data) {
        return loginHttp(data).then(async res => {
          if (res.data) {
            this.setToken(res.data.token)
            this.setUserInfo({
              userId: res.data.userId,
              userName: res.data.username
            })
            const routeStore = useRouteStore()
            const dynamicRoutes = await routeStore.buildRoutes()
            routeStore.addRouteBatch(dynamicRoutes)
            router.addRoute(pageError)
            this.setInitialized(true)
          }

          return res
        })
      },

      // 退出登录
      loginOutSystem() {
        clearCache()
        router.push({ name: 'Login' })
      }
    }
  }
)

export default useUserStore
