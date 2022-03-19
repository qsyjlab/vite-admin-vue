/*
 * @Description: vuex 入口文件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-12 16:58:20
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-19 23:15:03
 * @FilePath: \vite-admin-vue\src\store\index.ts
 */
import { createStore, useStore as useBaseStore, createLogger } from 'vuex'
import type { Store } from 'vuex'
import type { InjectionKey } from 'vue'

// 读取 module文件
const files = import.meta.globEager('./modules/*')

const modules: VStoreRoot.rootMoudles = {}

Object.keys(files).forEach(file => {
  const key: string = file.split('/').pop()?.split('.ts')[0] + ''
  if (!key) return
  modules[key] = files[file].default
})

// 唯一 key值
export const storeSymbolkey: InjectionKey<Store<VStoreRoot.rootState>> = Symbol('vuex store')

export default createStore<VStoreRoot.rootState>({
  mutations: {},
  actions: {},
  modules
})

/** 重写 useStore 方法 适配多模块类型 */
export const useStore = () => {
  return useBaseStore(storeSymbolkey)
}
