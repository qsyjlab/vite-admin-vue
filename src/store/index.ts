/*
 * @Description:
 * @Autor: qsyj
 * @Date: 2022-07-19 11:48:34
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 10:53:19
 */

import { useAppStore, useRouteStore, useUserStore } from './module'

export const useStore = () => {
  return {
    appStore: useAppStore(),
    routeStore: useRouteStore(),
    userStore: useUserStore()
  }
}

export * from './module'
export { useStore as default }
