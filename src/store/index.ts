/*
 * @Description: vuex 入口文件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-12 16:58:20
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 16:05:08
 * @FilePath: \vite-admin-vue\src\store\index.ts
 */
import { createStore } from 'vuex'

const files = import.meta.globEager('./modules/*')

const modules: VStoreRoot.rootMoudles = {}

Object.keys(files).forEach(file => {
    const key: string = file.split('/').pop()?.split('.ts')[0] + ''
    if (!key) return
    modules[key] = files[file].default
})

export default createStore<VStoreRoot.rootState>({
    state: {},
    mutations: {},
    actions: {},
    modules
})
