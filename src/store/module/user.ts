import { router } from '@/router'
import { useStorageHelper } from '@/hooks'

import useAppStore from './app'
import { defineStore } from 'pinia'

import { login as loginHttp } from '@/api/user'

export const userStoreKey = 'userStoreKey'

export const useUserStore = defineStore(userStoreKey, {
  state() {
    return {
      userInfo: {
        userId: '',
        userName: '',
        userRole: ''
      },
      // 权限
      permissions: ['Home', 'Welcome', 'Dashboard', 'Components']
    }
  },
  actions: {
    loginSystem(form: { username: string; password: string }) {
      return loginHttp(form).then(res => {
        const { setTokenCahce, setUserInfoCache } = useStorageHelper()

        const { data } = res

        setTokenCahce(data.token)
        setUserInfoCache(data)
      })
    },

    // 退出登录
    loginOutSystem() {
      const { clearCache, setLayoutCache } = useStorageHelper()
      clearCache()
      const appStore = useAppStore()
      setLayoutCache(appStore.layoutConfig)
      router.push({ name: 'Login' })
    }
  }
})

export default useUserStore
