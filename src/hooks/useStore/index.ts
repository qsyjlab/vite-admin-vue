/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-29 14:00:18
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 14:37:45
 */
import { useMapFunction } from './storeHooks'
import type { namespaceType, mapType, mapHelperType } from './storeHooks'

import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export type useHelperType = <T extends mapHelperType>(
  namespace: namespaceType,
  states: mapType
) => T

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
export const useMapStateHelper: useHelperType = (namespace, states) =>
  useMapFunction(namespace, states, mapState)

/**
 * mutactions
 * @param namespace 命名空间
 * @param mutations
 * @returns
 */
export const useMapMutactionsHelper: useHelperType = (namespace, mutations) =>
  useMapFunction(namespace, mutations, mapMutations, true)

/**
 * actions
 * @param namespace 命名空间
 * @param actions
 * @returns
 */
export const useMapActionsHelper: useHelperType = (namespace, actions) =>
  useMapFunction(namespace, actions, mapActions, true)

/**
 * getters
 * @param namespace 命名空间
 * @param getters
 * @returns
 */
export const useMapGettersHelper: useHelperType = (namespace, getters) =>
  useMapFunction(namespace, getters, mapGetters)
