import type { RouteRecordRaw } from 'vue-router'

export * from './resolve'
export * from './utils'

export type RouteModules = Record<
  string,
  {
    default: RouteRecordRaw | RouteRecordRaw[]
  }
>
