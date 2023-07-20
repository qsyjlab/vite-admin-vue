import type { RouteRecordRaw } from 'vue-router'
import { transformRoutes as menuFilter } from '@/router/helper'
import { asyncRoutes } from '../../routes'

export function getAsyncMenus() {
  return menuFilter(asyncRoutes)
}

export function getMenus() {
  return getAsyncMenus()
}
