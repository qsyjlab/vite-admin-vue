/*
 * @Description: vuex4 助手函数
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-29 14:00:18
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 22:17:04
 */

import type { Namespace, MapType, MapHelperType } from './storeHooks'

import { useMapFunction } from './storeHooks'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export type UseHelperType = <T extends MapHelperType>(namespace: Namespace, states: MapType) => T

/**
 * @description 传参格式
 *
 * 1. vuex默认的数组传参方式
 * 2. { default:[] ,hepler:{} }
 *    default:同第一种传参格式
 *    hepler: 同vuex辅助函数写法  example state=>state.app
 */

/**
 * state
 * @param namespace 命名空间
 * @param states 同state传参方式
 * @returns
 */
const useStateHelper: UseHelperType = (namespace, states) =>
  useMapFunction(namespace, states, mapState)

/**
 * mutactions
 * @param namespace 命名空间
 * @param mutations
 * @returns
 */
const useMutactionsHelper: UseHelperType = (namespace, mutations) =>
  useMapFunction(namespace, mutations, mapMutations, true)

/**
 * actions
 * @param namespace 命名空间
 * @param actions
 * @returns
 */
const useActionsHelper: UseHelperType = (namespace, actions) =>
  useMapFunction(namespace, actions, mapActions, true)

/**
 * getters
 * @param namespace 命名空间
 * @param getters
 * @returns
 */
const useGettersHelper: UseHelperType = (namespace, getters) =>
  useMapFunction(namespace, getters, mapGetters)

export default () => {
  return {
    useStateHelper,
    useMutactionsHelper,
    useActionsHelper,
    useGettersHelper
  }
}
