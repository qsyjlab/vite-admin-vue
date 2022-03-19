/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-29 13:20:02
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-19 23:03:57
 */
import { computed } from 'vue'
import { useStore } from '@/store'
// import type { mapState } from 'vuex'

export type Namespace = string
export type MapDefaultType = string[]
export type MapHelperType = Record<string, any>

export interface MapTypeHelperType {
  default?: MapDefaultType
  helper?: MapHelperType
}

export type MapType = MapDefaultType | MapTypeHelperType
export type funcType = boolean

//TODO: 类型优化
export type MapFuncType = any

export type useMapFuncType = <T extends MapHelperType>(
  namespace: Namespace,
  map: MapType,
  mapFunc: MapFuncType,
  funcType?: boolean
) => T

/**
 *
 * @param namespace 命名空间
 * @param map 见下详解
 * @param mapFunc vuex 原生函数
 * @param funcType true：mapMutations | mapActions  false: state,getters
 * @returns
 */
/**
 * @description 传参格式
 *
 * 1. vuex默认的数组传参方式
 * 2. { default:[] ,hepler:{} }
 *    default:同第一种传参格式
 *    hepler: 同vuex辅助函数写法  example state=>state.app
 */

export function useMapFunction<T extends MapHelperType>(
  namespace: Namespace,
  map: MapType,
  mapFunc: MapFuncType,
  funcType = false
): T {
  const store = useStore()

  //TODO: 类型优化
  let storeStateFncs: T

  if (Array.isArray(map)) {
    storeStateFncs = mapFunc(namespace, [...map])
  } else {
    const { default: _defaults = [], helper = {} } = map
    const defaultsMapFunc = mapFunc(namespace, [..._defaults])

    const helperMapFunc = mapFunc(namespace, helper)
    storeStateFncs = Object.assign({}, defaultsMapFunc, helperMapFunc)
  }

  //TODO: 类型优化
  const storeMap: any = {}

  Object.keys(storeStateFncs).forEach((funcKey: keyof typeof storeStateFncs) => {
    const func = storeStateFncs[funcKey].bind({ $store: store })

    if (funcType) {
      storeMap[funcKey] = func
    } else {
      storeMap[funcKey] = computed(func)
    }
  })

  return { ...(storeMap as T) }
}
