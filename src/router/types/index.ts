import type { RouteRecordRaw } from 'vue-router'

type RouteMenu = Pick<RouteRecordRaw, 'meta' | 'path' | 'redirect'>

export interface Menu extends RouteMenu {
  name: string
  children?: Menu[]
}
