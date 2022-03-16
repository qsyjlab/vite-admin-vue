/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-29 13:20:02
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 14:40:37
 */
import { computed } from 'vue'
import { useStore } from 'vuex'

export type namespaceType = string
export type mapDefaultType = string[]
export type mapHelperType = {
  [propName: string]: any
}

export interface mapTypeHelperType {
  default?: mapDefaultType
  helper?: mapHelperType
}

export type mapType = mapDefaultType | mapTypeHelperType
export type funcType = boolean
export type mapFuncType = any

export type useMapFuncType = <T extends mapHelperType>(
  namespace: namespaceType,
  map: mapType,
  mapFunc: mapFuncType,
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

export function useMapFunction<T extends mapHelperType>(
  namespace: namespaceType,
  map: mapType,
  mapFunc: mapFuncType,
  funcType = false
): T {
  const store = useStore()

  // console.log('mapFunc', mapFunc(namespace, ['getAlive']))

  let storeStateFncs: T

  if (Array.isArray(map)) {
    storeStateFncs = mapFunc(namespace, [...map])
    // console.log('defaultsMapFunc', storeStateFncs)
  } else {
    const { default: _defaults = [], helper = {} } = map as mapTypeHelperType
    const defaultsMapFunc = mapFunc(namespace, [..._defaults])

    // console.log('defaultsMapFunc', defaultsMapFunc)

    const helperMapFunc = mapFunc(namespace, helper)
    storeStateFncs = Object.assign({}, defaultsMapFunc, helperMapFunc)
  }

  const storeMap: any = {}

  Object.keys(storeStateFncs).forEach(funcKey => {
    const func = storeStateFncs[funcKey].bind({ $store: store })

    if (funcType) {
      storeMap[funcKey] = func
    } else {
      storeMap[funcKey] = computed(func)
    }
  })

  return { ...storeMap }
}
