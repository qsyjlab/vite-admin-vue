/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-01-05 16:55:33
 * @LastEditors: qsyj
 * @LastEditTime: 2022-01-05 17:26:45
 */

import type { Module } from 'vuex'

// import type { appRootState } from '../modleTypes/app'
import type { rootState } from '../types'

interface exampleRootState {
  count: number
}

const exampleMoudle: Module<exampleRootState, rootState> = {
  namespaced: true,
  state: {
    count: 0
  },
  mutations: {
    addCount(state, num) {
      state.count += num
    }
  },
  getters: {
    oddOrEven: (state: any) => (state.count % 2 === 0 ? '偶数' : '奇数')
  },
  actions: {
    addCountActions({ commit }, num) {
      commit('addCount', num)
    }
  }
}

export default exampleMoudle
