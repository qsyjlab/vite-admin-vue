/*
 * @Description: user vuex
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 14:41:54
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-22 21:54:01
 * @FilePath: \vite-admin-vue\src\store\modules\user.ts
 */

import type { Module } from 'vuex'
import { router } from '@/router'
import { ElMessage } from 'element-plus'
import { useStorageHelper } from '@/hooks'

const routeModule: Module<VStoreRoot.User.UserRootState, VStoreRoot.RootState> = {
  namespaced: true,
  state: {
    userInfo: {
      userId: '',
      userName: '',
      userRole: ''
    },
    // 权限
    permissions: ['Home', 'Welcome', 'Dashboard', 'Components', 'Form']
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
