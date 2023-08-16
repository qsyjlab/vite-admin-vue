import type { RouteRecordRaw } from 'vue-router'

export * from './resolve'
export * from './utils'
export * from './menus'

export type RouteModules = Record<
  string,
  {
    default: RouteRecordRaw | RouteRecordRaw[]
  }
>
