import { createStore, } from 'vuex'
import type { VStoreRoot } from '../types/store.d'

import type { StoreOptions } from 'vuex'

import { keyType, rootState } from './types'

const files = import.meta.globEager("./modules/*")


const modules: VStoreRoot.rootMoudles<StoreOptions<VStoreRoot.rootState>> = {}


Object.keys(files).forEach((file)=>{
  const key:string = file.split('/').pop()?.split('.ts')[0] + ''
  if(!key) return
  modules[key] = files[file].default
})

export default createStore<VStoreRoot.rootState>({
  state: {},
  mutations: {},
  actions: {},
  modules
})
