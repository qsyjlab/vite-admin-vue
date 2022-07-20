/*
 * @Description: user vuex
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 14:41:54
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 15:21:16
 * @FilePath: \vite-admin-vue\src\store\modules\user.ts
 */

// import type { Module, useStore } from 'vuex'
// : Module<VStoreRoot.User.UserRootState, VStoreRoot.RootState> =
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
