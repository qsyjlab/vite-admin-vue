import { router } from '@/router'
import { ElMessage } from 'element-plus'
import { useStorageHelper } from '@/hooks'
import useAppStore from './app'
import { defineStore } from 'pinia'

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
  // mutations: {},
  actions: {
    loginSystem(form: { username: string; password: string }) {
      const { setTokenCahce, setUserInfoCache } = useStorageHelper()

      setTokenCahce('token')
      setUserInfoCache({
        userId: 1,
        userName: 'ADMIN',
        userRole: 'ADMIN'
      })

      router.push({ name: 'Home' })

      // ElMessage({
      //   type: 'success',
      //   message: 'Login Success'
      // })
      ElMessage.success('Login Success')
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
