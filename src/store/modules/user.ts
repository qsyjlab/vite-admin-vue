/*
 * @Description: user vuex
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 14:41:54
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 16:03:52
 * @FilePath: \vite-admin-vue\src\store\modules\user.ts
 */

import type { Module } from 'vuex'
import { router } from '@/router'
import { ElMessage } from 'element-plus'
import { useStorageHelper } from '@/hooks'

const routeModule: Module<VStoreRoot.user.userRootState, VStoreRoot.rootState> = {
  namespaced: true,
  state: {
    userInfo: {
      userId: '',
      userName: '',
      userRole: ''
    },
    // 权限
    permissions: ['Home', 'Welcome', 'Dashboard']
  },
  mutations: {},
  actions: {
    loginSystem({ commit }, data) {
      const { setTokenCahce, setUserInfoCache } = useStorageHelper()

      setTokenCahce('token')
      setUserInfoCache({
        userId: 1,
        userName: 'ADMIN',
        userRole: 'ADMIN'
      })

      ElMessage.success('Login Success')
      router.push({ name: 'Home' })
    },

    // 退出登录
    loginOutSystem() {
      router.push({ name: 'Login' })
    }
  }
}

export default routeModule
