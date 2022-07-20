/*
 * @Description:
 * @Autor: qsyj
 * @Date: 2022-07-19 11:48:34
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 09:24:50
 */

import { useAppStore, useRouteStore, useUserStore } from './module'

export const useStore = () => {
  return {
    appStore: useAppStore(),
    routeStore: useRouteStore(),
    userStore: useUserStore()
  }
}

export { useAppStore, useRouteStore, useUserStore, useStore as default }
