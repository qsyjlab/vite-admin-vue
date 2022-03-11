/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-31 15:01:36
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-10 23:14:00
 */
import type { Module } from 'vuex'
import type { userRootState } from '../modleTypes/user'
import type { rootState } from '../types'

// import { loginApi } from '@api/user'

// import router from '@router'
// import { useStorage, useElement } from '@hooks'
// const { $storage } = useStorage()
// const { $message } = useElement()

const userMoudle: Module<userRootState, rootState> = {
  namespaced: true,
  state: {
    user:  {}
  },
  mutations: {
    // 设置用户token
    setUserToken(state, token) {
      // $storage.set('token', token)
    },
    // 保存用户信息
    setUserInfo(state, info) {
      state.user = info
      // $storage.set('user-info', info)
    },
    // 清除缓存
    clearUserInfo() {
      // $storage.clear()
    }
  },
  actions: {
    // 登录
    async userLogin({ commit }, data) {
      // const res = await loginApi(data)

      // if (!res.code) return $message.error('登录失败')

      // commit('setUserToken', res.data.token)
      // commit('setUserInfo', res.data)

      // $message.success('登录成功')
      // router.push({ name: 'Dashboard' })
    },
    // 登出
    loginOut({ commit }) {
      // commit('clearUserInfo')
      // router.push({ name: 'Login' })
    }
  },
  getters: {}
}

export { userMoudle as default }
